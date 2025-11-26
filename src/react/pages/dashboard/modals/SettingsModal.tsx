import { Modal, Stack, Text, Button, Divider, Switch, NumberInput, TextInput, Textarea, Loader, Center, Group } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState, useEffect } from "react";
import { useRemoteConfig, useUpdateRemoteConfig } from "../../../utils/query";
import type { RemoteConfig } from "../../../utils/types";

interface SettingsModalProps {
    opened: boolean;
    onClose: () => void;
}

export function SettingsModal({ opened, onClose }: SettingsModalProps) {
    const { data: config, isLoading, error } = useRemoteConfig();
    const updateConfig = useUpdateRemoteConfig();

    // Local state for form
    const [formData, setFormData] = useState<Partial<RemoteConfig>>({});

    // Update form data when config loads
    useEffect(() => {
        if (config) {
            setFormData(config);
        }
    }, [config]);

    const handleSaveSettings = async () => {
        try {
            await updateConfig.mutateAsync(formData);
            notifications.show({
                title: "✅ Impostazioni salvate",
                message: "Le modifiche sono state applicate con successo",
                color: "green",
                autoClose: 2000,
            });
            onClose();
        } catch (error) {
            notifications.show({
                title: "❌ Errore",
                message: "Impossibile salvare le impostazioni",
                color: "red",
                autoClose: 3000,
            });
        }
    };

    const updateField = <K extends keyof RemoteConfig>(field: K, value: RemoteConfig[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    if (isLoading) {
        return (
            <Modal opened={opened} onClose={onClose} title="⚙️ Impostazioni Globali" size="lg" centered>
                <Center py="xl">
                    <Loader size="lg" />
                </Center>
            </Modal>
        );
    }

    if (error) {
        return (
            <Modal opened={opened} onClose={onClose} title="⚙️ Impostazioni Globali" size="lg" centered>
                <Text c="red">Errore nel caricamento delle impostazioni</Text>
            </Modal>
        );
    }

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text fw={700} size="lg">⚙️ Impostazioni Globali</Text>}
            size="lg"
            centered
        >
            <Stack gap="md">
                <Text size="sm" c="dimmed">
                    Configura le impostazioni globali dell'evento.
                </Text>

                <Divider label="Funzionalità" labelPosition="center" />

                {/* Boolean Switches */}
                <Switch
                    label="Check-in aperto"
                    description="Permetti agli utenti di effettuare il check-in"
                    checked={formData.check_in_open ?? false}
                    onChange={(e) => updateField('check_in_open', e.currentTarget.checked)}
                />

                <Switch
                    label="Leaderboard visibile"
                    description="Mostra la classifica agli utenti"
                    checked={formData.leaderboard_open ?? false}
                    onChange={(e) => updateField('leaderboard_open', e.currentTarget.checked)}
                />

                <Switch
                    label="Estrazione aperta"
                    description="Abilita la funzione di estrazione premi"
                    checked={formData.draw_open ?? false}
                    onChange={(e) => updateField('draw_open', e.currentTarget.checked)}
                />

                <Divider label="Quiz" labelPosition="center" />

                {/* Quiz Settings */}
                <NumberInput
                    label="Punti quiz"
                    description="Punti base assegnati per quiz"
                    value={formData.quiz_points ?? 0}
                    onChange={(value) => updateField('quiz_points', Number(value))}
                    min={0}
                    step={10}
                />

                <NumberInput
                    label="Tempo per domanda (ms)"
                    description="Millisecondi disponibili per ogni domanda"
                    value={formData.time_per_question ?? 0}
                    onChange={(value) => updateField('time_per_question', Number(value))}
                    min={1000}
                    step={1000}
                />

                <Divider label="Estrazione Premi" labelPosition="center" />

                {/* Draw Settings */}
                <TextInput
                    label="Data e ora estrazione"
                    description="Formato: GG/MM/AAAA HH:MM"
                    value={formData.draw_time ? new Date(formData.draw_time).toLocaleString('it-IT') : ''}
                    onChange={(e) => {
                        const dateValue = e.currentTarget.value;
                        try {
                            const date = new Date(dateValue);
                            if (!isNaN(date.getTime())) {
                                updateField('draw_time', date);
                            }
                        } catch { }
                    }}
                    placeholder="29/11/2025 18:00"
                />

                <TextInput
                    label="Stanza vincitori"
                    description="Dove verranno annunciati i vincitori"
                    value={formData.winner_room ?? ''}
                    onChange={(e) => updateField('winner_room', e.currentTarget.value)}
                    placeholder="es. Aula A"
                />

                <TextInput
                    label="Orario annuncio vincitori"
                    description="A che ora verranno annunciati i vincitori"
                    value={formData.winner_time ?? ''}
                    onChange={(e) => updateField('winner_time', e.currentTarget.value)}
                    placeholder="es. 6:00 PM"
                />

                <Divider label="Informazioni Concorso" labelPosition="center" />

                {/* Contest Info */}
                <TextInput
                    label="Titolo informazioni"
                    value={formData.info_title ?? ''}
                    onChange={(e) => updateField('info_title', e.currentTarget.value)}
                    placeholder="es. Regole del Concorso"
                />

                <Textarea
                    label="Contenuto informazioni"
                    description="Descrizione delle regole del concorso"
                    value={formData.info_content ?? ''}
                    onChange={(e) => updateField('info_content', e.currentTarget.value)}
                    placeholder="Scrivi le regole del concorso..."
                    minRows={4}
                    autosize
                />

                {/* Action Buttons */}
                <Divider />
                <Group justify="flex-end" gap="sm">
                    <Button variant="subtle" onClick={onClose}>
                        Annulla
                    </Button>
                    <Button
                        onClick={handleSaveSettings}
                        color="green"
                        loading={updateConfig.isPending}
                    >
                        Salva Impostazioni
                    </Button>
                </Group>
            </Stack>
        </Modal>
    );
}
