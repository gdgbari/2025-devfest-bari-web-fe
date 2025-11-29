import { useState } from "react"
import {
    Modal,
    Stack,
    TextInput,
    Button,
    Group,
    Text,
    Select,
} from "@mantine/core"
import { useCreateUser } from "../../../utils/query"
import { Role } from "../../../utils/types"

interface CreateUserModalProps {
    opened: boolean
    onClose: () => void
}

export const CreateUserModal = ({ opened, onClose }: CreateUserModalProps) => {
    const [newUser, setNewUser] = useState({
        name: "",
        surname: "",
        email: "",
        nickname: "",
        password: "",
        role: Role.ATTENDEE,
    })

    const createUserMutation = useCreateUser()

    const handleCreate = async () => {
        if (!newUser.name || !newUser.surname || !newUser.email || !newUser.nickname || !newUser.password) {
            alert("Tutti i campi sono obbligatori")
            return
        }

        try {
            await createUserMutation.mutateAsync({
                name: newUser.name,
                surname: newUser.surname,
                email: newUser.email,
                nickname: newUser.nickname,
                password: newUser.password,
                role: newUser.role,
            })
            handleClose()
        } catch (error) {
            console.error("Errore nella creazione:", error)
            alert("Errore nella creazione dell'utente")
        }
    }

    const handleClose = () => {
        setNewUser({
            name: "",
            surname: "",
            email: "",
            nickname: "",
            password: "",
            role: Role.ATTENDEE,
        })
        onClose()
    }

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={<Text fw={700} size="lg">Crea Nuovo Utente</Text>}
            size="lg"
            centered
        >
            <Stack gap="md">
                <TextInput
                    label="Nome"
                    required
                    value={newUser.name}
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                    placeholder="Inserisci il nome"
                />
                <TextInput
                    label="Cognome"
                    required
                    value={newUser.surname}
                    onChange={(e) => setNewUser({ ...newUser, surname: e.target.value })}
                    placeholder="Inserisci il cognome"
                />
                <TextInput
                    label="Email"
                    type="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    placeholder="Inserisci l'email"
                />
                <TextInput
                    label="Nickname"
                    required
                    value={newUser.nickname}
                    onChange={(e) => setNewUser({ ...newUser, nickname: e.target.value })}
                    placeholder="Inserisci il nickname"
                />
                <TextInput
                    label="Password"
                    type="password"
                    required
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    placeholder="Inserisci la password"
                />
                <Select
                    label="Ruolo"
                    required
                    data={Object.values(Role)}
                    value={newUser.role}
                    onChange={(value) => setNewUser({ ...newUser, role: value as Role })}
                    allowDeselect={false}
                />

                {/* Pulsanti azione */}
                <Group justify="flex-end" mt="md">
                    <Button variant="subtle" onClick={handleClose}>
                        Annulla
                    </Button>
                    <Button
                        onClick={handleCreate}
                        loading={createUserMutation.isPending}
                        color="green"
                    >
                        Crea Utente
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
