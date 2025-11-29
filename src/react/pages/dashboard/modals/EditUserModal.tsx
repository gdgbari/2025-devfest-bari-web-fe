import { useState, useEffect } from "react"
import {
    Modal,
    Stack,
    TextInput,
    Button,
    Group,
    Text,
    Card,
    CopyButton,
    Select,
} from "@mantine/core"
import { useUpdateUser } from "../../../utils/query"
import { Role } from "../../../utils/types"
import type { GetUserResponse } from "../../../utils/types"

interface EditUserModalProps {
    user: GetUserResponse | null
    opened: boolean
    onClose: () => void
}

export const EditUserModal = ({ user, opened, onClose }: EditUserModalProps) => {
    const [editedUser, setEditedUser] = useState({
        name: "",
        surname: "",
        email: "",
        role: Role.ATTENDEE,
    })

    const updateUserMutation = useUpdateUser()

    useEffect(() => {
        if (user) {
            setEditedUser({
                name: user.name || "",
                surname: user.surname || "",
                email: user.email || "",
                role: user.role || Role.ATTENDEE,
            })
        }
    }, [user])

    const handleSave = async () => {
        if (!user) return

        try {
            await updateUserMutation.mutateAsync({
                uid: user.uid,
                data: {
                    name: editedUser.name,
                    surname: editedUser.surname,
                    email: editedUser.email,
                    role: editedUser.role,
                }
            })
            onClose()
        } catch (error) {
            console.error("Errore nell'aggiornamento:", error)
            alert("Errore nell'aggiornamento dell'utente")
        }
    }

    const handleClose = () => {
        setEditedUser({
            name: "",
            surname: "",
            email: "",
            role: Role.ATTENDEE,
        })
        onClose()
    }

    if (!user) return null

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={<Text fw={700} size="lg">Dettagli Utente</Text>}
            size="lg"
            centered
        >
            <Stack gap="md">
                {/* Info non modificabili */}
                <Card withBorder padding="sm" radius="md" bg="dark.6">
                    <Stack gap="xs">
                        <Group gap="xs">
                            <Text size="xs" c="dimmed" fw={500}>UID:</Text>
                            <CopyButton value={user.uid}>
                                {({ copied, copy }) => (
                                    <Text
                                        size="xs"
                                        c={copied ? "green" : "blue"}
                                        className="cursor-pointer hover:underline"
                                        onClick={copy}
                                    >
                                        {user.uid}
                                    </Text>
                                )}
                            </CopyButton>
                        </Group>
                        <Group gap="xs">
                            <Text size="xs" c="dimmed" fw={500}>Nickname:</Text>
                            <Text size="xs">{user.nickname}</Text>
                        </Group>
                        {user.group && (
                            <Group gap="xs">
                                <Text size="xs" c="dimmed" fw={500}>Gruppo:</Text>
                                <Group gap={6}>
                                    <div
                                        style={{
                                            width: 10,
                                            height: 10,
                                            borderRadius: '50%',
                                            backgroundColor: user.group.color,
                                        }}
                                    />
                                    <Text size="xs">{user.group.name}</Text>
                                </Group>
                            </Group>
                        )}
                    </Stack>
                </Card>

                {/* Campi modificabili */}
                <TextInput
                    label="Nome"
                    value={editedUser.name}
                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                    placeholder="Inserisci il nome"
                />
                <TextInput
                    label="Cognome"
                    value={editedUser.surname}
                    onChange={(e) => setEditedUser({ ...editedUser, surname: e.target.value })}
                    placeholder="Inserisci il cognome"
                />
                <TextInput
                    label="Email"
                    type="email"
                    value={editedUser.email}
                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                    placeholder="Inserisci l'email"
                />
                <Select
                    label="Ruolo"
                    data={Object.values(Role)}
                    value={editedUser.role}
                    onChange={(value) => setEditedUser({ ...editedUser, role: value as Role })}
                    allowDeselect={false}
                />

                {/* Pulsanti azione */}
                <Group justify="flex-end" mt="md">
                    <Button variant="subtle" onClick={handleClose}>
                        Annulla
                    </Button>
                    <Button
                        onClick={handleSave}
                        loading={updateUserMutation.isPending}
                    >
                        Salva Modifiche
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
