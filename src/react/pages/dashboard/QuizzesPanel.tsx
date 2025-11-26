import { useState, useEffect } from "react"
import {
    Stack,
    Group,
    Card,
    Badge,
    Text,
    Center,
    ActionIcon,
    SimpleGrid,
    Tooltip,
    Menu,
    Loader,
    Button,
    Switch,
    Modal,
    TextInput,
} from "@mantine/core"
import { IoAdd, IoPencil, IoTrash, IoCheckmark, IoClose, IoQrCodeOutline, IoSearch } from "react-icons/io5"
import { useQuizzes, useDeleteQuiz, useUpdateQuiz, useSessionizeSessions } from "../../utils/query"
import type { GetQuizWithCorrectResponse } from "../../utils/types"
import { CreateQuizModal } from "./modals/CreateQuizModal"
import { EditQuizModal } from "./modals/EditQuizModal"
import { ViewQuizModal } from "./modals/ViewQuizModal"
import { QuizQRCodeModal } from "./modals/QuizQRCodeModal"


import { formatDuration } from "../../utils/formatting"

export const QuizzesPanel = () => {
    const { data: quizzesData, isLoading, error } = useQuizzes()
    const deleteQuizMutation = useDeleteQuiz()
    const updateQuizMutation = useUpdateQuiz()
    const { data: sessions } = useSessionizeSessions()
    const [animatingQuizzes, setAnimatingQuizzes] = useState<Set<string>>(new Set())
    const [selectedQuiz, setSelectedQuiz] = useState<GetQuizWithCorrectResponse | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isQRCodeModalOpen, setIsQRCodeModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [quizToDelete, setQuizToDelete] = useState<string | null>(null)
    const [query, setQuery] = useState("")

    const handleOpenEditModal = (quiz: GetQuizWithCorrectResponse) => {
        setSelectedQuiz(quiz)
        setIsEditModalOpen(true)
    }

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false)
        setSelectedQuiz(null)
    }

    const handleOpenViewModal = (quiz: GetQuizWithCorrectResponse) => {
        setSelectedQuiz(quiz)
        setIsViewModalOpen(true)
    }

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false)
        setSelectedQuiz(null)
    }

    const handleOpenQRCodeModal = (quiz: GetQuizWithCorrectResponse) => {
        setSelectedQuiz(quiz)
        setIsQRCodeModalOpen(true)
    }

    const handleCloseQRCodeModal = () => {
        setIsQRCodeModalOpen(false)
        setSelectedQuiz(null)
    }

    const handleOpenDeleteModal = (quiz_id: string) => {
        setQuizToDelete(quiz_id)
        setIsDeleteModalOpen(true)
    }

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setQuizToDelete(null)
    }

    const handleConfirmDelete = async () => {
        if (!quizToDelete) return

        try {
            await deleteQuizMutation.mutateAsync(quizToDelete)
            handleCloseDeleteModal()
        } catch (error) {
            console.error("Errore nell'eliminazione:", error)
            alert("Errore nell'eliminazione del quiz")
        }
    }

    const handleDeleteQuiz = async (quiz_id: string) => {
        handleOpenDeleteModal(quiz_id)
    }

    const handleToggleQuizStatus = async (quiz_id: string, currentStatus: boolean) => {
        // Aggiungi il quiz al set di animazioni
        setAnimatingQuizzes(prev => new Set(prev).add(quiz_id))

        try {
            await updateQuizMutation.mutateAsync({
                quiz_id,
                data: { is_open: !currentStatus }
            })

            // Rimuovi l'animazione dopo 1 secondo
            setTimeout(() => {
                setAnimatingQuizzes(prev => {
                    const newSet = new Set(prev)
                    newSet.delete(quiz_id)
                    return newSet
                })
            }, 1000)
        } catch (error) {
            console.error("Errore nell'aggiornamento:", error)
            alert("Errore nell'aggiornamento dello stato del quiz")
            // Rimuovi l'animazione anche in caso di errore
            setAnimatingQuizzes(prev => {
                const newSet = new Set(prev)
                newSet.delete(quiz_id)
                return newSet
            })
        }
    }

    if (isLoading) {
        return (
            <Center py="xl">
                <Loader size="lg" />
            </Center>
        )
    }

    if (error) {
        return (
            <Center py="xl">
                <Text c="red">Errore nel caricamento dei quiz: {error.message}</Text>
            </Center>
        )
    }

    const quizzes = quizzesData?.quizzes ?? []

    // Filter quizzes based on search query
    const filteredQuizzes = quizzes.filter(quiz => {
        const q = query.trim().toLowerCase()
        if (!q) return true

        const sessionTitle = sessions?.find(s => s.id === quiz.session_id)?.title?.toLowerCase() || ''

        return (
            quiz.title.toLowerCase().includes(q) ||
            quiz.quiz_id.toLowerCase().includes(q) ||
            sessionTitle.includes(q) ||
            quiz.question_list.some(question => question.text.toLowerCase().includes(q))
        )
    })

    return (
        <Stack gap="lg">
            {/* Search Bar and Add Button */}
            <Card withBorder radius="md" padding="md">
                <Group justify="space-between" wrap="wrap" gap="md">
                    <TextInput
                        placeholder="Cerca per titolo, sessione o domanda..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        size="md"
                        radius="md"
                        style={{ flex: 1, minWidth: 250 }}
                        leftSection={<IoSearch size={18} />}
                    />
                    <Button
                        size="md"
                        radius="md"
                        color="green"
                        leftSection={<IoAdd size={20} />}
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        Nuovo Quiz
                    </Button>
                </Group>
            </Card>

            {/* Quiz List */}
            {filteredQuizzes.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing="lg">
                    {filteredQuizzes.map((quiz) => {
                        const isAnimating = animatingQuizzes.has(quiz.quiz_id)
                        const animationStyle = isAnimating
                            ? {
                                animation: quiz.is_open
                                    ? 'pulseGreen 1s ease-out'
                                    : 'pulseGray 1s ease-out',
                                transition: 'all 0.3s ease-in-out',
                                transform: 'scale(1.02)',
                            }
                            : {}

                        return (
                            <Card
                                key={quiz.quiz_id}
                                padding="md"
                                radius="md"
                                withBorder
                                shadow="sm"
                                className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                                style={animationStyle}
                                onClick={() => handleOpenViewModal(quiz)}
                            >
                                {/* Header con titolo e azioni */}
                                <Group justify="space-between" mb="sm" wrap="nowrap">
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <Text fw={600} size="md" truncate>
                                            {quiz.title}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {quiz.question_list.length} domand{quiz.question_list.length === 1 ? 'a' : 'e'}
                                        </Text>
                                    </div>
                                    <Group gap={4} wrap="nowrap">
                                        <Menu shadow="md" width={140} position="bottom-end">
                                            <Menu.Target>
                                                <ActionIcon
                                                    variant="light"
                                                    size="sm"
                                                    radius="sm"
                                                    aria-label="Altre azioni"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    ⋮
                                                </ActionIcon>
                                            </Menu.Target>
                                            <Menu.Dropdown>
                                                <Menu.Item onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleOpenEditModal(quiz)
                                                }}>
                                                    <Group gap={8}>
                                                        <IoPencil size={16} />
                                                        <span>Modifica</span>
                                                    </Group>
                                                </Menu.Item>
                                                <Menu.Item onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleOpenQRCodeModal(quiz)
                                                }}>
                                                    <Group gap={8}>
                                                        <IoQrCodeOutline size={16} />
                                                        <span>QR Code</span>
                                                    </Group>
                                                </Menu.Item>
                                                <Menu.Divider />
                                                <Menu.Item
                                                    color="red"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        handleDeleteQuiz(quiz.quiz_id)
                                                    }}
                                                >
                                                    <Group gap={8}>
                                                        <IoTrash size={16} />
                                                        <span>Elimina</span>
                                                    </Group>
                                                </Menu.Item>
                                            </Menu.Dropdown>
                                        </Menu>
                                    </Group>
                                </Group>

                                {/* Stato e info */}
                                <Stack gap="sm" mb="md">
                                    <Group justify="space-between">
                                        <Text size="xs" fw={500} c="dimmed">
                                            Stato:
                                        </Text>
                                        <Badge
                                            color={quiz.is_open ? "green" : "gray"}
                                            leftSection={quiz.is_open ? <IoCheckmark size={12} /> : <IoClose size={12} />}
                                        >
                                            {quiz.is_open ? "Aperto" : "Chiuso"}
                                        </Badge>
                                    </Group>

                                    <Group justify="space-between">
                                        <Text size="xs" fw={500} c="dimmed">
                                            Durata:
                                        </Text>
                                        <Text size="xs">
                                            {formatDuration(quiz.timer_duration)}
                                        </Text>
                                    </Group>

                                    <Group justify="space-between">
                                        <Text size="xs" fw={500} c="dimmed">
                                            Punteggio max:
                                        </Text>
                                        <Text size="xs" fw={600}>
                                            {quiz.question_list.reduce((sum, q) => sum + (q.value ?? 10), 0)} pt
                                        </Text>
                                    </Group>

                                    {quiz.session_id && (
                                        <Group justify="space-between">
                                            <Text size="xs" fw={500} c="dimmed">
                                                Sessione:
                                            </Text>
                                            <Text size="xs" truncate style={{ maxWidth: 150 }}>
                                                {sessions?.find(s => s.id === quiz.session_id)?.title || quiz.session_id}
                                            </Text>
                                        </Group>
                                    )}
                                </Stack>

                                {/* Toggle stato */}
                                <Group
                                    justify="space-between"
                                    pt="xs"
                                    style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <Text size="xs" c="dimmed">
                                        Apri/Chiudi quiz
                                    </Text>
                                    <Switch
                                        checked={quiz.is_open}
                                        onChange={() => handleToggleQuizStatus(quiz.quiz_id, quiz.is_open)}
                                        color="green"
                                    />
                                </Group>
                            </Card>
                        )
                    })}
                </SimpleGrid>
            ) : (
                <Card withBorder radius="md" padding="xl">
                    <Center>
                        <Stack align="center" gap="md">
                            <IoSearch size={48} style={{ opacity: 0.2 }} />
                            <Text c="dimmed" size="lg">Nessun quiz trovato</Text>
                            <Text c="dimmed" size="sm">
                                {query ? "Prova a modificare i filtri di ricerca" : "Crea un nuovo quiz per iniziare"}
                            </Text>
                        </Stack>
                    </Center>
                </Card>
            )}

            {/* Modals */}
            <ViewQuizModal
                quiz={selectedQuiz}
                opened={isViewModalOpen}
                onClose={handleCloseViewModal}
            />
            <EditQuizModal
                quiz={selectedQuiz}
                opened={isEditModalOpen}
                onClose={handleCloseEditModal}
            />
            <CreateQuizModal
                opened={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
            <QuizQRCodeModal
                quizId={selectedQuiz?.quiz_id || null}
                quizTitle={selectedQuiz?.title || null}
                opened={isQRCodeModalOpen}
                onClose={handleCloseQRCodeModal}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                opened={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                title={
                    <Group gap="xs">
                        <IoTrash size={24} color="red" />
                        <Text size="lg" fw={700}>
                            Conferma eliminazione
                        </Text>
                    </Group>
                }
                centered
            >
                <Stack gap="lg">
                    <Text>
                        Sei sicuro di voler eliminare questo quiz?
                        <br />
                        <Text component="span" fw={700} c="red">
                            Questa azione è irreversibile.
                        </Text>
                    </Text>
                    <Group justify="flex-end" gap="sm">
                        <Button
                            variant="light"
                            color="gray"
                            onClick={handleCloseDeleteModal}
                        >
                            Annulla
                        </Button>
                        <Button
                            color="red"
                            leftSection={<IoTrash size={18} />}
                            onClick={handleConfirmDelete}
                            loading={deleteQuizMutation.isPending}
                        >
                            Elimina
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Stack>
    )
}
