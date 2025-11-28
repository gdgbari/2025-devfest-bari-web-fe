import { useState, useEffect } from "react"
import {
    Modal,
    Stack,
    TextInput,
    Button,
    Group,
    Text,
    NumberInput,
    Textarea,
    ActionIcon,
    Card,
    Divider,
    Select,
    Checkbox,
} from "@mantine/core"
import { IoAdd, IoTrash } from "react-icons/io5"
import { useCreateQuiz, useSessionizeSessions } from "../../../utils/query"
import type { QuestionSchema, AnswerSchema } from "../../../utils/types"

interface CreateQuizModalProps {
    opened: boolean
    onClose: () => void
}

const generateId = () => crypto.randomUUID()

export const CreateQuizModal = ({ opened, onClose }: CreateQuizModalProps) => {
    const [title, setTitle] = useState("")
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [useCustomTitle, setUseCustomTitle] = useState(false)

    // Helper to create a default question with random IDs
    const createDefaultQuestion = (): QuestionSchema => {
        const answers = [
            { id: generateId(), text: "" },
            { id: generateId(), text: "" },
            { id: generateId(), text: "" },
            { id: generateId(), text: "" },
        ]
        return {
            text: "",
            answer_list: answers,
            correct_answer: answers[0].id,
        }
    }

    const [questions, setQuestions] = useState<QuestionSchema[]>([
        createDefaultQuestion(),
        createDefaultQuestion(),
        createDefaultQuestion()
    ])

    const createQuizMutation = useCreateQuiz()
    const { data: sessions } = useSessionizeSessions()

    // Auto-populate title from session when session changes
    useEffect(() => {
        if (sessionId && !useCustomTitle) {
            const selectedSession = sessions?.find(s => String(s.id) === sessionId)
            if (selectedSession) {
                setTitle(selectedSession.title)
            }
        }
    }, [sessionId, useCustomTitle, sessions])

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            createDefaultQuestion()
        ])
    }

    const handleRemoveQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index))
    }

    const handleQuestionChange = (index: number, field: keyof QuestionSchema, value: any) => {
        const newQuestions = [...questions]
        newQuestions[index] = { ...newQuestions[index], [field]: value }
        setQuestions(newQuestions)
    }

    const handleAnswerChange = (qIndex: number, aIndex: number, text: string) => {
        const newQuestions = [...questions]
        newQuestions[qIndex].answer_list[aIndex].text = text
        setQuestions(newQuestions)
    }

    const handleAddAnswer = (qIndex: number) => {
        const newQuestions = [...questions]
        const newId = generateId()
        newQuestions[qIndex].answer_list.push({ id: newId, text: "" })
        setQuestions(newQuestions)
    }

    const handleRemoveAnswer = (qIndex: number, aIndex: number) => {
        const newQuestions = [...questions]
        if (newQuestions[qIndex].answer_list.length > 2) {
            const removedAnswer = newQuestions[qIndex].answer_list[aIndex]
            newQuestions[qIndex].answer_list.splice(aIndex, 1)

            // Se la risposta rimossa era quella corretta, imposta la prima disponibile come corretta
            if (newQuestions[qIndex].correct_answer === removedAnswer.id) {
                newQuestions[qIndex].correct_answer = newQuestions[qIndex].answer_list[0].id
            }
            setQuestions(newQuestions)
        }
    }

    const handleCreate = async () => {
        if (!title.trim()) {
            alert("Inserisci un titolo per il quiz")
            return
        }

        if (!sessionId) {
            alert("Seleziona una sessione per il quiz")
            return
        }

        if (questions.some(q => !q.text.trim())) {
            alert("Tutte le domande devono avere un testo")
            return
        }

        if (questions.some(q => q.answer_list.some(a => !a.text.trim()))) {
            alert("Tutte le risposte devono avere un testo")
            return
        }

        try {
            await createQuizMutation.mutateAsync({
                title,
                question_list: questions,
                session_id: sessionId,
            })
            handleClose()
        } catch (error) {
            console.error("Errore nella creazione:", error)
            alert("Errore nella creazione del quiz")
        }
    }

    const handleClose = () => {
        setTitle("")
        setSessionId(null)
        setUseCustomTitle(false)
        setQuestions([
            createDefaultQuestion(),
            createDefaultQuestion(),
            createDefaultQuestion()
        ])
        onClose()
    }

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={<Text fw={700} size="lg">Crea Nuovo Quiz</Text>}
            size="xl"
            centered
        >
            <Stack gap="md">
                <Select
                    label="Sessione"
                    placeholder="Seleziona una sessione"
                    data={sessions?.filter(s => s.id).map(s => ({ value: String(s.id), label: `[${s.id}] ${s.title}` })) || []}
                    value={sessionId}
                    onChange={setSessionId}
                    searchable
                    required
                />

                <Checkbox
                    label="Usa titolo personalizzato"
                    checked={useCustomTitle}
                    onChange={(e) => setUseCustomTitle(e.currentTarget.checked)}
                />

                {useCustomTitle && (
                    <TextInput
                        label="Titolo Quiz"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Inserisci il titolo del quiz"
                    />
                )}

                <Divider label="Domande" />

                {questions.map((question, qIndex) => (
                    <Card key={qIndex} withBorder padding="md" radius="md">
                        <Stack gap="sm">
                            <Group justify="space-between" wrap="nowrap">
                                <Text fw={600} size="sm">Domanda {qIndex + 1}</Text>
                                {questions.length > 1 && (
                                    <ActionIcon
                                        color="red"
                                        variant="light"
                                        size="sm"
                                        onClick={() => handleRemoveQuestion(qIndex)}
                                    >
                                        <IoTrash size={16} />
                                    </ActionIcon>
                                )}
                            </Group>

                            <Textarea
                                label="Testo della domanda"
                                required
                                value={question.text}
                                onChange={(e) => handleQuestionChange(qIndex, 'text', e.target.value)}
                                placeholder="Inserisci la domanda"
                                minRows={2}
                            />

                            <Text size="xs" fw={500}>Risposte:</Text>
                            {question.answer_list.map((answer, aIndex) => (
                                <Group key={aIndex} gap="xs" wrap="nowrap">
                                    <TextInput
                                        style={{ flex: 1 }}
                                        placeholder={`Risposta ${aIndex + 1}`}
                                        value={answer.text}
                                        onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                        rightSection={
                                            question.correct_answer === answer.id && (
                                                <Text size="xs" c="green" fw={600}>✓</Text>
                                            )
                                        }
                                    />
                                    <Button
                                        size="xs"
                                        variant={question.correct_answer === answer.id ? "filled" : "light"}
                                        color="green"
                                        onClick={() => handleQuestionChange(qIndex, 'correct_answer', answer.id)}
                                    >
                                        Corretta
                                    </Button>
                                    {question.answer_list.length > 2 && (
                                        <ActionIcon
                                            color="red"
                                            variant="light"
                                            size="sm"
                                            onClick={() => handleRemoveAnswer(qIndex, aIndex)}
                                        >
                                            <IoTrash size={14} />
                                        </ActionIcon>
                                    )}
                                </Group>
                            ))}
                            <Button
                                size="xs"
                                variant="light"
                                leftSection={<IoAdd size={14} />}
                                onClick={() => handleAddAnswer(qIndex)}
                            >
                                Aggiungi Risposta
                            </Button>
                        </Stack>
                    </Card>
                ))}

                <Button
                    variant="light"
                    leftSection={<IoAdd size={18} />}
                    onClick={handleAddQuestion}
                >
                    Aggiungi Domanda
                </Button>

                {/* Pulsanti azione */}
                <Group justify="flex-end" mt="md">
                    <Button variant="subtle" onClick={handleClose}>
                        Annulla
                    </Button>
                    <Button
                        onClick={handleCreate}
                        loading={createQuizMutation.isPending}
                        color="green"
                    >
                        Crea Quiz
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
