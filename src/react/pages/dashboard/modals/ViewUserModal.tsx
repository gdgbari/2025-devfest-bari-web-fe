import { Modal, Stack, Text, Badge, Group, Box, Select, Button, Divider, Loader, Center } from "@mantine/core";
import type { GetUserResponse } from "../../../utils/types";
import { colorConverter } from "../../../utils";
import { IoPricetag, IoAdd } from "react-icons/io5";
import { useState } from "react";
import { useAllTags, useUser, useUserQuizResults, useUserProfile } from "../../../utils/query";
import { Role } from "../../../utils/types";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";

interface ViewUserModalProps {
    opened: boolean;
    onClose: () => void;
    user: GetUserResponse | null;
    onTagAssigned?: () => void;
}

export function ViewUserModal({ opened, onClose, user: initialUser, onTagAssigned }: ViewUserModalProps) {
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    const [assigning, setAssigning] = useState(false);
    const { data: tagsData } = useAllTags();
    const queryClient = useQueryClient();

    // Fetch fresh user data using the user's UID
    const { data: freshUser, isLoading: isLoadingUser } = useUser(initialUser?.uid || "");

    // Use fresh data if available, otherwise fall back to initial user
    const user = freshUser || initialUser;

    if (!user && !isLoadingUser) return null;

    const groupColor = user?.group?.color ? colorConverter(user.group.color) : "#666";
    const assignedTagIds = user?.tags?.map(t => t.tag_id) || [];
    const availableTags = tagsData?.tags.filter(tag => !assignedTagIds.includes(tag.tag_id)) || [];

    const handleAssignTag = async () => {
        if (!selectedTagId || !user) return;

        setAssigning(true);
        try {
            const { assignTagRequest } = await import("../../../utils/requests");
            await assignTagRequest({ tag_id: selectedTagId, uid: user.uid });

            notifications.show({
                title: "✅ Successo",
                message: "Tag assegnato correttamente",
                color: "green",
                autoClose: 2000,
            });

            // Refetch queries to immediately update user data
            await Promise.all([
                queryClient.refetchQueries({ queryKey: ["users"] }),
                queryClient.refetchQueries({ queryKey: ["user", user.uid] }),
                queryClient.refetchQueries({ queryKey: ["user-profile"] }),
            ]);

            setSelectedTagId(null);
            onTagAssigned?.();
        } catch (error) {
            console.error(error);
            notifications.show({
                title: "❌ Errore",
                message: "Impossibile assegnare il tag",
                color: "red",
                autoClose: 3000,
            });
        } finally {
            setAssigning(false);
        }
    };

    if (isLoadingUser) {
        return (
            <Modal
                opened={opened}
                onClose={onClose}
                title="Dettagli Utente"
                size="md"
                centered
            >
                <Center p="xl">
                    <Loader size="lg" />
                </Center>
            </Modal>
        );
    }

    if (!user) return null;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Dettagli Utente"
            size="md"
            centered
        >
            <Stack gap="md">
                {/* Info personali */}
                <Box>
                    <Text size="xs" c="dimmed" mb={4}>
                        Nome completo
                    </Text>
                    <Text size="md" fw={500}>
                        {user.name} {user.surname}
                    </Text>
                </Box>

                <Box>
                    <Text size="xs" c="dimmed" mb={4}>
                        Email
                    </Text>
                    <Text size="md">{user.email}</Text>
                </Box>

                <Box>
                    <Text size="xs" c="dimmed" mb={4}>
                        Nickname
                    </Text>
                    <Text size="md" fw={500}>
                        {user.nickname}
                    </Text>
                </Box>

                {/* Ruolo */}
                {user.role && (
                    <Box>
                        <Text size="xs" c="dimmed" mb={4}>
                            Ruolo
                        </Text>
                        <Badge
                            size="md"
                            variant="light"
                            color={
                                user.role === 'admin' ? 'red' :
                                    user.role === 'staff' ? 'orange' :
                                        user.role === 'speaker' ? 'blue' : 'gray'
                            }
                        >
                            {user.role}
                        </Badge>
                    </Box>
                )}

                {/* Gruppo */}
                {user.group && (
                    <Box>
                        <Text size="xs" c="dimmed" mb={4}>
                            Gruppo
                        </Text>
                        <Group gap="xs">
                            <Box
                                style={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    backgroundColor: groupColor,
                                }}
                            />
                            <Text size="md">{user.group.name}</Text>
                        </Group>
                    </Box>
                )}

                {/* Tags */}
                {user.tags && user.tags.length > 0 && (
                    <Box>
                        <Text size="xs" c="dimmed" mb={4}>
                            Tags
                        </Text>
                        <Group gap="xs">
                            {user.tags.map((tag, index) => (
                                <Badge key={index} variant="light" color="blue" leftSection={<IoPricetag size={12} />}>
                                    {tag.tag_id} ({tag.points} pt)
                                </Badge>
                            ))}
                        </Group>
                    </Box>
                )}

                {/* Tag Assignment Section */}
                <Divider label="Assegna Tag" labelPosition="center" />

                <Box>
                    <Text size="xs" c="dimmed" mb={8}>
                        Seleziona un tag da assegnare a questo utente
                    </Text>
                    <Stack gap="sm">
                        <Select
                            placeholder="Seleziona un tag"
                            data={availableTags.map(tag => ({
                                value: tag.tag_id,
                                label: `${tag.tag_id} (${tag.points} punti)`
                            }))}
                            value={selectedTagId}
                            onChange={setSelectedTagId}
                            searchable
                            clearable
                            nothingFoundMessage="Nessun tag disponibile"
                            disabled={availableTags.length === 0}
                        />
                        <Button
                            leftSection={<IoAdd size={16} />}
                            onClick={handleAssignTag}
                            disabled={!selectedTagId || assigning}
                            loading={assigning}
                            color="green"
                            fullWidth
                        >
                            Assegna Tag
                        </Button>
                    </Stack>
                </Box>

                {/* UID */}
                <Box>
                    <Text size="xs" c="dimmed" mb={4}>
                        UID
                    </Text>
                    <Text size="sm" c="dimmed" style={{ fontFamily: "monospace" }}>
                        {user.uid}
                    </Text>
                </Box>

                {/* Quiz Results Section (Staff Only) */}
                <QuizResultsSection uid={user.uid} />
            </Stack>
        </Modal>
    );
}

function QuizResultsSection({ uid }: { uid: string }) {
    const { data: currentUser } = useUserProfile();
    const { data: quizResults, isLoading } = useUserQuizResults(uid);

    // Only show for staff and above
    const isStaff = currentUser?.role === Role.STAFF || currentUser?.role === Role.ADMIN;

    if (!isStaff) return null;

    return (
        <>
            <Divider label="Risultati Quiz" labelPosition="center" />
            <Box>
                {isLoading ? (
                    <Center>
                        <Loader size="sm" />
                    </Center>
                ) : !quizResults?.results || quizResults.results.length === 0 ? (
                    <Text size="sm" c="dimmed" ta="center">
                        Nessun quiz completato
                    </Text>
                ) : (
                    <Stack gap="xs">
                        {quizResults.results.map((result, index) => (
                            <Group key={index} justify="space-between" p="xs" wrap="nowrap" style={{ border: "1px solid #e0e0e0", borderRadius: 8 }}>
                                <Box style={{ flex: 1, minWidth: 0 }}>
                                    <Text size="sm" fw={500} truncate>
                                        {result.quiz_title}
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        {new Date(result.submitted_at).toLocaleString()}
                                    </Text>
                                </Box>
                                <Badge
                                    color={result.score === result.max_score ? "green" : "blue"}
                                    variant="light"
                                    style={{ flexShrink: 0 }}
                                >
                                    {result.score}/{result.max_score} pt
                                </Badge>
                            </Group>
                        ))}
                    </Stack>
                )}
            </Box>
        </>
    );
}
