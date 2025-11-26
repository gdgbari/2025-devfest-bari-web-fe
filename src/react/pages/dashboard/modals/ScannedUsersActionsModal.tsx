import { Modal, Stack, Text, Button, Group, Card, Badge, Divider, ActionIcon, Tooltip, Container, Space } from "@mantine/core";
import { IoEye, IoRemoveCircle } from "react-icons/io5";
import { useAllUsers } from "../../../utils/query";
import type { GetUserResponse } from "../../../utils/types";
import { colorConverter } from "../../../utils";

interface ScannedUsersActionsModalProps {
    opened: boolean;
    onClose: () => void;
    scannedUserIds: string[];
    onViewUser: (user: GetUserResponse) => void;
    onRemoveUser: (uid: string) => void;
}

export function ScannedUsersActionsModal({
    opened,
    onClose,
    scannedUserIds,
    onViewUser,
    onRemoveUser,
}: ScannedUsersActionsModalProps) {
    const { data: usersData } = useAllUsers();

    const scannedUsers = scannedUserIds
        .map(uid => usersData?.users.find(u => u.uid === uid))
        .filter(Boolean) as GetUserResponse[];

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
                            Operazioni disponibili:
                        </Text>

                        {/* Placeholder per future operazioni */}
                        <Card padding="sm" radius="md" withBorder bg="dark.6">
                            <Stack gap="xs">
                                <Group justify="space-between">
                                    <Text size="sm" fw={500}>
                                        🏷️ Assegna Tag
                                    </Text>
                                    <Badge size="sm" color="yellow" variant="light">
                                        Prossimamente
                                    </Badge>
                                </Group>
                                <Text size="xs" c="dimmed">
                                    Assegna tag con punteggio agli utenti selezionati
                                </Text>
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
