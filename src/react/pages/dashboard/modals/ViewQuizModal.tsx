import { Modal, Stack, Text, Badge, Group, Box, Divider } from "@mantine/core";
import type { GetQuizWithCorrectResponse } from "../../../utils/types";
import { useSessionizeSessions } from "../../../utils/query";
import { formatDuration } from "../../../utils/formatting";

interface ViewQuizModalProps {
    opened: boolean;
    onClose: () => void;
    quiz: GetQuizWithCorrectResponse | null;
}

export function ViewQuizModal({ opened, onClose, quiz }: ViewQuizModalProps) {
    const { data: sessions } = useSessionizeSessions();
    if (!quiz) return null;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Dettagli Quiz"
            size="lg"
            centered
        >
            <Stack gap="md">
                {/* Header info */}
                <Group justify="space-between">
                    <Box style={{ flex: 1 }}>
                        <Text size="lg" fw={600}>
                            {quiz.title}
                        </Text>
                    </Box>
                    <Badge color={quiz.is_open ? "green" : "gray"} size="lg">
                        {quiz.is_open ? "Aperto" : "Chiuso"}
                    </Badge>
                </Group>

                {/* Metadata */}
                <Box
                    p="md"
                    style={{
                        backgroundColor: "rgba(255, 255, 255, 0.05)",
                        borderRadius: 8,
                    }}
                >
                    <Stack gap="xs">
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                ID Quiz
                            </Text>
                            <Text size="sm" style={{ fontFamily: "monospace" }}>
                                {quiz.quiz_id}
                            </Text>
                        </Group>
                        {quiz.timer_duration && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Durata
                                </Text>
                                <Badge color="blue" variant="light">
                                    {formatDuration(quiz.timer_duration)}
                                </Badge>
                            </Group>
                        )}
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Numero domande
                            </Text>
                            <Badge color="cyan" variant="light">
                                {quiz.question_list.length} domande
                            </Badge>
                        </Group>
                        <Group justify="space-between">
                            <Text size="sm" c="dimmed">
                                Punteggio totale
                            </Text>
                            <Badge color="green" variant="light">
                                {quiz.question_list.reduce((acc, q) => acc + (q.value || 0), 0)}{" "}
                                punti
                            </Badge>
                        </Group>
                        {quiz.session_id && (
                            <Group justify="space-between">
                                <Text size="sm" c="dimmed">
                                    Sessione
                                </Text>
                                <Text size="sm" style={{ fontFamily: "monospace" }}>
                                    [{quiz.session_id}] {sessions?.find(s => s.id === quiz.session_id)?.title || "**Unknown**"}
                                </Text>
                            </Group>
                        )}
                    </Stack>
                </Box>

                <Divider label="Domande" labelPosition="center" />

                {/* Questions */}
                <Stack gap="lg">
                    {quiz.question_list.map((question, qIndex) => (
                        <Box
                            key={qIndex}
                            p="md"
                            style={{
                                backgroundColor: "rgba(255, 255, 255, 0.03)",
                                borderRadius: 8,
                                border: "1px solid rgba(255, 255, 255, 0.1)",
                            }}
                        >
                            <Group justify="space-between" mb="sm">
                                <Text size="sm" fw={600}>
                                    Domanda {qIndex + 1}
                                </Text>
                                <Badge color="green" size="sm" variant="light">
                                    {question.value || 0} punti
                                </Badge>
                            </Group>

                            <Text size="sm" mb="md">
                                {question.text}
                            </Text>

                            <Stack gap="xs">
                                <Text size="xs" c="dimmed" mb={4}>
                                    Risposte:
                                </Text>
                                {question.answer_list.map((answer) => {
                                    const isCorrect = answer.id === question.correct_answer;
                                    return (
                                        <Group
                                            key={answer.id}
                                            gap="xs"
                                            p="xs"
                                            style={{
                                                backgroundColor: isCorrect
                                                    ? "rgba(64, 192, 87, 0.15)"
                                                    : "rgba(255, 255, 255, 0.05)",
                                                borderRadius: 6,
                                                border: isCorrect
                                                    ? "1px solid rgba(64, 192, 87, 0.3)"
                                                    : "1px solid transparent",
                                            }}
                                        >
                                            {isCorrect && (
                                                <Badge color="green" size="xs" variant="filled">
                                                    ✓
                                                </Badge>
                                            )}
                                            <Text
                                                size="sm"
                                                c={isCorrect ? "green" : undefined}
                                                fw={isCorrect ? 500 : undefined}
                                            >
                                                {answer.text}
                                            </Text>
                                        </Group>
                                    );
                                })}
                            </Stack>
                        </Box>
                    ))}
                </Stack>
            </Stack>
        </Modal>
    );
}
