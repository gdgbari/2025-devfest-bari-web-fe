import { Modal, Stack, Text, Button, Group, Card, Badge, Divider, ActionIcon, Tooltip, Container, Space, Select, Progress } from "@mantine/core";
import { IoEye, IoRemoveCircle, IoPricetag } from "react-icons/io5";
import { useState } from "react";
import { useAllUsers, useAllTags } from "../../../utils/query";
import type { GetUserResponse } from "../../../utils/types";
import { colorConverter } from "../../../utils";
import { notifications } from "@mantine/notifications";
import { useQueryClient } from "@tanstack/react-query";

interface ScannedUsersActionsModalProps {
    opened: boolean;
    onClose: () => void;
    scannedUserIds: string[];
    onViewUser: (user: GetUserResponse) => void;
    onRemoveUser: (uid: string) => void;
    onAssignmentComplete?: () => void;
}

export function ScannedUsersActionsModal({
    opened,
    onClose,
    scannedUserIds,
    onViewUser,
    onRemoveUser,
    onAssignmentComplete,
}: ScannedUsersActionsModalProps) {
    const { data: usersData } = useAllUsers();
    const { data: tagsData } = useAllTags();
    const queryClient = useQueryClient();
    const [selectedTagId, setSelectedTagId] = useState<string | null>(null);
    const [assigning, setAssigning] = useState(false);
    const [assignmentProgress, setAssignmentProgress] = useState(0);

    const scannedUsers = scannedUserIds
        .map(uid => usersData?.users.find(u => u.uid === uid))
        .filter(Boolean) as GetUserResponse[];

    const handleBatchAssignTag = async () => {
        if (!selectedTagId || scannedUsers.length === 0) return;

        setAssigning(true);
        setAssignmentProgress(0);

        const { assignTagRequest } = await import("../../../utils/requests");

        let successCount = 0;
        let errorCount = 0;
        const errors: string[] = [];

        for (let i = 0; i < scannedUsers.length; i++) {
            const user = scannedUsers[i];
            try {
                await assignTagRequest({ tag_id: selectedTagId, uid: user.uid });
                successCount++;
            } catch (error) {
                console.error(`Failed to assign tag to ${user.nickname}:`, error);
                errorCount++;
                errors.push(user.nickname);
            }
            setAssignmentProgress(((i + 1) / scannedUsers.length) * 100);
        }

        setAssigning(false);
        setAssignmentProgress(0);

        if (successCount > 0) {
            notifications.show({
                title: "✅ Successo",
                message: `Tag assegnato a ${successCount} utente${successCount > 1 ? 'i' : ''}`,
                color: "green",
                autoClose: 3000,
            });

            // Refetch queries to immediately update user data
            await Promise.all([
                queryClient.refetchQueries({ queryKey: ["users"] }),
                queryClient.refetchQueries({ queryKey: ["user-profile"] }),
            ]);
        }

        if (errorCount > 0) {
            notifications.show({
                title: "⚠️ Errori durante l'assegnazione",
                message: `Impossibile assegnare il tag a: ${errors.join(", ")}`,
                color: "orange",
                autoClose: 5000,
            });
        }

        setSelectedTagId(null);
        onAssignmentComplete?.();
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text fw={700} size="lg">🎯 Gestione Utenti Scansionati</Text>}
            centered
            fullScreen
        >
            <Container size="lg">
                <Space h="xl" />
                <Stack gap="md">
                    <Text size="sm" c="dimmed">
                        Seleziona un'operazione da eseguire sugli utenti scansionati.
                    </Text>

                    <Divider label={`${scannedUsers.length} utenti selezionati`} labelPosition="center" />

                    {scannedUsers.length === 0 ? (
                        <Text size="sm" c="dimmed" ta="center" py="xl">
                            Nessun utente scansionato
                        </Text>
                    ) : (
                        <Stack gap="sm">
                            {scannedUsers.map((user) => {
                                const groupColor = user.group ? colorConverter(user.group.color) : colorConverter("blue");

                                return (
                                    <Card
                                        key={user.uid}
                                        padding="sm"
                                        radius="md"
                                        withBorder
                                        style={{
                                            borderLeft: `4px solid ${groupColor}`,
                                        }}
                                    >
                                        <Group justify="space-between" wrap="nowrap">
                                            <Group gap="sm">
                                                <div
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: "50%",
                                                        backgroundColor: groupColor,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        color: "white",
                                                        fontWeight: "bold",
                                                        fontSize: "14px",
                                                    }}
                                                >
                                                    {user.name?.[0]?.toUpperCase() || "?"}
                                                </div>
                                                <div>
                                                    <Text size="sm" fw={600}>
                                                        {user.name} {user.surname}
                                                    </Text>
                                                    <Group gap={6}>
                                                        <Text size="xs" c="dimmed">
                                                            @{user.nickname}
                                                        </Text>
                                                        <Badge size="xs" variant="light">
                                                            {user.email}
                                                        </Badge>
                                                    </Group>
                                                </div>
                                            </Group>
                                            <Group gap="xs">
                                                <Tooltip label="Visualizza dettagli">
                                                    <ActionIcon
                                                        color="blue"
                                                        variant="light"
                                                        onClick={() => onViewUser(user)}
                                                    >
                                                        <IoEye size={18} />
                                                    </ActionIcon>
                                                </Tooltip>
                                                <Tooltip label="Rimuovi">
                                                    <ActionIcon
                                                        color="red"
                                                        variant="light"
                                                        onClick={() => onRemoveUser(user.uid)}
                                                    >
                                                        <IoRemoveCircle size={18} />
                                                    </ActionIcon>
                                                </Tooltip>
                                            </Group>
                                        </Group>
                                    </Card>
                                );
                            })}
                        </Stack>
                    )}

                    <Divider label="Operazioni" labelPosition="center" />

                    <Stack gap="xs">
                        <Text size="sm" fw={500} c="dimmed">
                            Assegna Tag a tutti gli utenti:
                        </Text>

                        <Card padding="sm" radius="md" withBorder>
                            <Stack gap="md">
                                <Group gap="xs">
                                    <IoPricetag size={20} color="var(--mantine-color-blue-6)" />
                                    <Text size="sm" fw={500}>
                                        Assegna Tag
                                    </Text>
                                </Group>

                                <Select
                                    placeholder="Seleziona un tag da assegnare"
                                    data={tagsData?.tags.map(tag => ({
                                        value: tag.tag_id,
                                        label: `${tag.tag_id} (${tag.points} punti)`
                                    })) || []}
                                    value={selectedTagId}
                                    onChange={setSelectedTagId}
                                    searchable
                                    clearable
                                    disabled={scannedUsers.length === 0 || assigning}
                                    nothingFoundMessage="Nessun tag disponibile"
                                />

                                {assigning && (
                                    <Progress
                                        value={assignmentProgress}
                                        size="sm"
                                        animated
                                        color="blue"
                                    />
                                )}

                                <Button
                                    leftSection={<IoPricetag size={16} />}
                                    onClick={handleBatchAssignTag}
                                    disabled={!selectedTagId || scannedUsers.length === 0 || assigning}
                                    loading={assigning}
                                    color="blue"
                                    fullWidth
                                >
                                    {assigning ? "Assegnazione in corso..." : `Assegna a ${scannedUsers.length} utente${scannedUsers.length > 1 ? 'i' : ''}`}
                                </Button>
                            </Stack>
                        </Card>
                    </Stack>

                    <Divider />

                    <Button variant="light" onClick={onClose} fullWidth>
                        Chiudi
                    </Button>
                </Stack>
            </Container>
        </Modal >
    );
}
