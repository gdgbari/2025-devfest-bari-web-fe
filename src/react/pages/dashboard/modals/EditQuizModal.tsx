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
    Badge,
    Select,
} from "@mantine/core"
import { IoAdd, IoTrash, IoCheckmark, IoClose } from "react-icons/io5"
import { useUpdateQuiz, useSessionizeSessions } from "../../../utils/query"
import type { GetQuizWithCorrectResponse, QuestionSchema } from "../../../utils/types"

// Helper per formattare il tempo in modo dinamico
const formatDuration = (milliseconds: number): string => {
    const totalSeconds = Math.floor(milliseconds / 1000);

    if (totalSeconds < 60) {
        return `${totalSeconds} sec`;
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    if (minutes < 60) {
        if (seconds === 0) {
            return `${minutes} min`;
        }
        return `${minutes} min ${seconds} sec`;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (remainingMinutes === 0) {
        return `${hours} h`;
    }
    return `${hours} h ${remainingMinutes} min`;
};

interface EditQuizModalProps {
    quiz: GetQuizWithCorrectResponse | null
    opened: boolean
    onClose: () => void
}

export const EditQuizModal = ({ quiz, opened, onClose }: EditQuizModalProps) => {
    const [title, setTitle] = useState("")
    const [sessionId, setSessionId] = useState<string | null>(null)
    const [questions, setQuestions] = useState<QuestionSchema[]>([])

    const updateQuizMutation = useUpdateQuiz()
    const { data: sessions } = useSessionizeSessions()

    useEffect(() => {
        if (quiz) {
            setTitle(quiz.title)
            setSessionId(quiz.session_id || null)
            setQuestions(quiz.question_list.map(q => ({
                text: q.text,
                answer_list: q.answer_list,
                correct_answer: q.correct_answer,
                value: q.value,
            })))
        }
    }, [quiz])

    const handleAddQuestion = () => {
        setQuestions([
            ...questions,
            {
                text: "",
                answer_list: [
                    { id: "0", text: "" },
                    { id: "1", text: "" },
                ],
                correct_answer: "0",
                value: 10,
            }
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
        const newId = newQuestions[qIndex].answer_list.length.toString()
        newQuestions[qIndex].answer_list.push({ id: newId, text: "" })
        setQuestions(newQuestions)
    }

    const handleRemoveAnswer = (qIndex: number, aIndex: number) => {
        const newQuestions = [...questions]
        if (newQuestions[qIndex].answer_list.length > 2) {
            newQuestions[qIndex].answer_list.splice(aIndex, 1)
            // Rigenera gli ID
            newQuestions[qIndex].answer_list = newQuestions[qIndex].answer_list.map((a, i) => ({
                ...a,
                id: i.toString()
            }))
            // Aggiusta correct_answer se necessario
            if (parseInt(newQuestions[qIndex].correct_answer) >= newQuestions[qIndex].answer_list.length) {
                newQuestions[qIndex].correct_answer = "0"
            }
            setQuestions(newQuestions)
        }
    }

    const handleSave = async () => {
        if (!quiz) return

        if (!title.trim()) {
            alert("Inserisci un titolo per il quiz")
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
            await updateQuizMutation.mutateAsync({
                quiz_id: quiz.quiz_id,
                data: {
                    title,
                    question_list: questions,
                    session_id: sessionId,
                }
            })
            handleClose()
        } catch (error) {
            console.error("Errore nell'aggiornamento:", error)
            alert("Errore nell'aggiornamento del quiz")
        }
    }

    const handleClose = () => {
        setTitle("")
        setSessionId(null)
        setQuestions([])
        onClose()
    }

    if (!quiz) return null

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={<Text fw={700} size="lg">Modifica Quiz</Text>}
            size="xl"
            centered
        >
            <Stack gap="md">
                {/* Info non modificabili */}
                <Card withBorder padding="sm" radius="md" bg="dark.6">
                    <Group justify="space-between">
                        <Group gap="xs">
                            <Text size="xs" c="dimmed" fw={500}>Stato:</Text>
                            <Badge
                                color={quiz.is_open ? "green" : "gray"}
                                leftSection={quiz.is_open ? <IoCheckmark size={12} /> : <IoClose size={12} />}
                                size="sm"
                            >
                                {quiz.is_open ? "Aperto" : "Chiuso"}
                            </Badge>
                        </Group>
                        <Group gap="xs">
                            <Text size="xs" c="dimmed" fw={500}>Durata:</Text>
                            <Text size="xs">{formatDuration(quiz.timer_duration)}</Text>
                        </Group>
                    </Group>
                </Card>

                <TextInput
                    label="Titolo Quiz"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Inserisci il titolo del quiz"
                />

                <Select
                    label="Sessione"
                    placeholder="Seleziona una sessione"
                    data={sessions?.filter(s => s.id).map(s => ({ value: String(s.id), label: s.title })) || []}
                    value={sessionId}
                    onChange={setSessionId}
                    searchable
                    clearable
                />

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

                            <NumberInput
                                label="Punteggio"
                                value={question.value}
                                onChange={(v) => handleQuestionChange(qIndex, 'value', v)}
                                min={1}
                                max={100}
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
                                            question.correct_answer === aIndex.toString() && (
                                                <Text size="xs" c="green" fw={600}>✓</Text>
                                            )
                                        }
                                    />
                                    <Button
                                        size="xs"
                                        variant={question.correct_answer === aIndex.toString() ? "filled" : "light"}
                                        color="green"
                                        onClick={() => handleQuestionChange(qIndex, 'correct_answer', aIndex.toString())}
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
                        onClick={handleSave}
                        loading={updateQuizMutation.isPending}
                    >
                        Salva Modifiche
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
