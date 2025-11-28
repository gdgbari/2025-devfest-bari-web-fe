import type { UserProfile } from "../utils/types"
import { useState } from "react"
import {
    Container,
    Title,
    Tabs,
    Stack,
    Group,
    Badge,
    Center,
    Menu,
    ActionIcon,
    Tooltip,
} from "@mantine/core"
import { IoPersonCircle, IoSettingsSharp, IoDownload, IoQrCodeOutline, IoTrash } from "react-icons/io5"
import { notifications } from "@mantine/notifications"
import { UsersPanel } from "./dashboard/UsersPanel"
import { QuizzesPanel } from "./dashboard/QuizzesPanel"
import { LeaderboardPanel } from "./dashboard/LeaderboardPanel"
import { QRScanPanel } from "./dashboard/QRScanPanel"
import { TagsPanel } from "./dashboard/TagsPanel"
import { SettingsModal } from "./dashboard/modals/SettingsModal"
import { ResetDataModal } from "./dashboard/modals/ResetDataModal"
import { useQuizzes } from "../utils/query"

type DashboardProps = {
    user: UserProfile
}

export const Dashboard = ({ user }: DashboardProps) => {
    const [activeTab, setActiveTab] = useState<string | null>('users')
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
    const [isResetModalOpen, setIsResetModalOpen] = useState(false)
    const { data: quizzesData } = useQuizzes()

    const handleDownloadAllQRCodes = async () => {
        const quizzes = quizzesData?.quizzes ?? []

        if (quizzes.length === 0) {
            notifications.show({
                title: "⚠️ Nessun quiz disponibile",
                message: "Non ci sono quiz da cui generare QR code",
                color: "yellow",
                autoClose: 3000,
            })
            return
        }

        notifications.show({
            id: 'qr-download',
            title: "📦 Download in corso...",
            message: `Generazione di ${quizzes.length} QR code...`,
            color: "blue",
            loading: true,
            autoClose: false,
        })

        try {
            // Dinamicamente importa JSZip e la utility per QR
            const JSZip = (await import('jszip')).default
            const { generateStyledQRCode } = await import('../utils/qrcode')

            const zip = new JSZip()
            const qrFolder = zip.folder("quiz-qrcodes")

            if (!qrFolder) {
                throw new Error("Impossibile creare la cartella nello ZIP")
            }

            // Genera QR code per ogni quiz
            for (const quiz of quizzes) {
                try {
                    // Genera il QR code con logo
                    const qrDataUrl = await generateStyledQRCode(`quiz:${quiz.quiz_id}`, {
                        size: 800,
                        logoImage: '/assets/images/icons/icon-512x512.png',
                        logoWidth: 200,
                    })

                    // Rimuovi il prefisso per ottenere solo i dati base64
                    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '')

                    // Crea un nome file sicuro
                    const safeTitle = quiz.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()
                    const fileName = `${safeTitle}_${quiz.quiz_id}.png`

                    // Aggiungi il file allo ZIP
                    qrFolder.file(fileName, base64Data, { base64: true })
                } catch (error) {
                    console.error(`Errore generazione QR per quiz ${quiz.quiz_id}:`, error)
                }
            }

            // Genera lo ZIP
            const zipBlob = await zip.generateAsync({ type: 'blob' })

            // Download dello ZIP
            const link = document.createElement('a')
            link.href = URL.createObjectURL(zipBlob)
            link.download = `quiz-qrcodes-${new Date().toISOString().split('T')[0]}.zip`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(link.href)

            notifications.update({
                id: 'qr-download',
                title: "✅ Download completato",
                message: `${quizzes.length} QR code scaricati con successo`,
                color: "green",
                loading: false,
                autoClose: 3000,
            })
        } catch (error) {
            console.error("Errore nel download dei QR code:", error)
            notifications.update({
                id: 'qr-download',
                title: "❌ Errore",
                message: "Si è verificato un errore durante la generazione dei QR code",
                color: "red",
                loading: false,
                autoClose: 5000,
            })
        }
    }

    return (
        <Container size="xl" py="xl">
            {/* Header Section */}
            <Stack gap="lg" mb="xl">
                <Group justify="space-between" align="center">
                    <Group justify="center" gap="xs" style={{ flex: 1 }}>
                        <Title order={1} size="h1" fw={700}>
                            Benvenuto/a {user.name} {user.surname}
                        </Title>
                    </Group>

                    {/* Settings Menu */}
                    <Menu shadow="md" width={250} position="bottom-end">
                        <Menu.Target>
                            <Tooltip label="Impostazioni" withArrow>
                                <ActionIcon
                                    size="xl"
                                    variant="light"
                                    color="gray"
                                    aria-label="Apri menu impostazioni"
                                >
                                    <IoSettingsSharp size={24} />
                                </ActionIcon>
                            </Tooltip>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Opzioni Generali</Menu.Label>
                            <Menu.Item
                                leftSection={<IoSettingsSharp size={16} />}
                                onClick={() => setIsSettingsModalOpen(true)}
                            >
                                Impostazioni
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Label>Download</Menu.Label>
                            <Menu.Item
                                leftSection={<IoQrCodeOutline size={16} />}
                                onClick={handleDownloadAllQRCodes}
                            >
                                Scarica tutti i QR Code
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Label c="red">Zona Pericolosa</Menu.Label>
                            <Menu.Item
                                color="red"
                                leftSection={<IoTrash size={16} />}
                                onClick={() => setIsResetModalOpen(true)}
                            >
                                Reset Dati Evento
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
                <Center>
                    <Badge size="lg" variant="light" leftSection={<IoPersonCircle size={16} />}>
                        Ruolo: {user.role}
                    </Badge>
                </Center>
            </Stack>

            {/* Tabs Section */}
            <Tabs
                value={activeTab}
                onChange={setActiveTab}
                defaultValue="users"
                variant="outline"
                mb="xl"
            >
                <Tabs.List grow>
                    <Tabs.Tab value="users">
                        Utenti
                    </Tabs.Tab>
                    <Tabs.Tab value="quiz">
                        Quiz
                    </Tabs.Tab>
                    <Tabs.Tab value="leaderboard">
                        Leaderboard
                    </Tabs.Tab>
                    <Tabs.Tab value="qrscan">
                        QR Scanner
                    </Tabs.Tab>
                    <Tabs.Tab value="tags">
                        Tags
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="users" py="xl">
                    <UsersPanel />
                </Tabs.Panel>

                <Tabs.Panel value="quiz" py="xl">
                    <QuizzesPanel />
                </Tabs.Panel>

                <Tabs.Panel value="leaderboard" py="xl">
                    <LeaderboardPanel />
                </Tabs.Panel>

                <Tabs.Panel value="qrscan" py="xl">
                    <QRScanPanel isActive={activeTab === 'qrscan'} />
                </Tabs.Panel>

                <Tabs.Panel value="tags" py="xl">
                    <TagsPanel />
                </Tabs.Panel>
            </Tabs>

            {/* Settings Modal */}
            <SettingsModal
                opened={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />

            {/* Reset Data Modal */}
            <ResetDataModal
                opened={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
            />
        </Container>
    )
}