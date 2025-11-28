import { Modal, Stack, Text, Button, Group, Alert, TextInput } from "@mantine/core"
import { useResetData } from "../../../utils/query"
import { notifications } from "@mantine/notifications"
import { IoWarning } from "react-icons/io5"
import { useState } from "react"

interface ResetDataModalProps {
    opened: boolean
    onClose: () => void
}

export function ResetDataModal({ opened, onClose }: ResetDataModalProps) {
    const resetDataMutation = useResetData()
    const [confirmationText, setConfirmationText] = useState("")
    const CONFIRMATION_KEYWORD = "RESET"

    const handleReset = async () => {
        if (confirmationText !== CONFIRMATION_KEYWORD) return

        try {
            await resetDataMutation.mutateAsync()
            notifications.show({
                title: "✅ Dati resettati",
                message: "Tutti i dati sono stati cancellati con successo",
                color: "green",
                autoClose: 3000,
            })
            onClose()
            setConfirmationText("")
        } catch (error) {
            console.error("Errore nel reset dei dati:", error)
            notifications.show({
                title: "❌ Errore",
                message: "Impossibile resettare i dati",
                color: "red",
                autoClose: 3000,
            })
        }
    }

    const handleClose = () => {
        setConfirmationText("")
        onClose()
    }

    return (
        <Modal
            opened={opened}
            onClose={handleClose}
            title={<Text fw={700} c="red">⚠️ ZONA PERICOLOSA: Reset Dati</Text>}
            centered
        >
            <Stack gap="md">
                <Alert color="red" icon={<IoWarning size={24} />}>
                    Questa azione è <b>IRREVERSIBILE</b>.
                    <br />
                    Verranno cancellati permanentemente:
                    <ul>
                        <li>Tutti i punteggi della leaderboard</li>
                        <li>Tutte le assegnazioni dei tag</li>
                        <li>Tutti i risultati dei quiz</li>
                    </ul>
                    Gli utenti e i gruppi NON verranno eliminati.
                </Alert>

                <Text size="sm">
                    Per confermare, scrivi <b>{CONFIRMATION_KEYWORD}</b> nel campo sottostante.
                </Text>

                <TextInput
                    placeholder={`Scrivi "${CONFIRMATION_KEYWORD}" per confermare`}
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.currentTarget.value)}
                    error={confirmationText && confirmationText !== CONFIRMATION_KEYWORD ? "La parola chiave non corrisponde" : null}
                />

                <Group justify="flex-end" gap="sm" mt="md">
                    <Button variant="default" onClick={handleClose}>
                        Annulla
                    </Button>
                    <Button
                        color="red"
                        onClick={handleReset}
                        loading={resetDataMutation.isPending}
                        disabled={confirmationText !== CONFIRMATION_KEYWORD}
                    >
                        CONFERMA RESET
                    </Button>
                </Group>
            </Stack>
        </Modal>
    )
}
