import { Modal, Stack, Text, Badge, Group, Box } from "@mantine/core";
import type { GetUserResponse } from "../../../utils/types";
import { colorConverter } from "../../../utils";

interface ViewUserModalProps {
    opened: boolean;
    onClose: () => void;
    user: GetUserResponse | null;
}

export function ViewUserModal({ opened, onClose, user }: ViewUserModalProps) {
    if (!user) return null;

    const groupColor = user.group?.color ? colorConverter(user.group.color) : "#666";

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

                {/* UID */}
                <Box>
                    <Text size="xs" c="dimmed" mb={4}>
                        UID
                    </Text>
                    <Text size="sm" c="dimmed" style={{ fontFamily: "monospace" }}>
                        {user.uid}
                    </Text>
                </Box>
            </Stack>
        </Modal>
    );
}
