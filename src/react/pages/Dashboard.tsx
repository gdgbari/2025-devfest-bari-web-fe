import type { UserProfile } from "../utils/types"
import { useEffect, useState } from "react"
import { onValue, ref } from "firebase/database"
import { firebase } from "../utils"
import { getMockUsers } from "./AppPage"
import {
    Container,
    Title,
    Text,
    Tabs,
    TextInput,
    Stack,
    Group,
    Card,
    Badge,
    Button,
    Paper,
    Center,
    ActionIcon,
    SimpleGrid,
    CopyButton,
    Tooltip,
    Menu,
} from "@mantine/core"
import { IoAdd, IoPencil, IoTrash, IoPersonCircle, IoSearch } from "react-icons/io5"

type DashboardProps = {
    user: UserProfile
}

export const Dashboard = ({ user }: DashboardProps) => {
    const [activeTab, setActiveTab] = useState<string | null>('users')
    const [query, setQuery] = useState("")
    const [users, setUsers] = useState<UserProfile[]>(() => getMockUsers().map(u => u.data))

    useEffect(() => {
        const unsubscribe = onValue(ref(firebase.database, "users"), (snap) => {
            const val = snap.val() as Record<string, UserProfile> | null
            if (!val) {
                setUsers([])
                return
            }
            const list: UserProfile[] = Object.entries(val).map(([uid, p]) => ({
                uid,
                nickname: p.nickname,
                email: p.email,
                name: p.name,
                surname: p.surname,
                group: p.group,
                role: p.role,
            }))
            setUsers(list)
        })
        return () => unsubscribe()
    }, [])

    const filteredUsers = users.filter(u => {
        const q = query.trim().toLowerCase()
        if (!q) return true
        return (
            u.name.toLowerCase().includes(q) ||
            u.surname.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.nickname.toLowerCase().includes(q) ||
            u.uid.toLowerCase().includes(q)
        )
    })

    return (
        <Container size="xl" py="xl">
            {/* Header Section */}
            <Stack gap="lg" mb="xl">
                <Group justify="center" gap="xs">
                    <Title order={1} size="h1" fw={700}>
                        Benvenuto/a {user.name} {user.surname}
                    </Title>
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
                </Tabs.List>

                <Tabs.Panel value="users" py="xl">
                    <Stack gap="lg">
                        {/* Search Bar and Add Button */}
                        <Group justify="space-between" wrap="wrap" gap="md">
                            <TextInput
                                placeholder="Cerca per nome, email, nickname o ID..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                size="md"
                                radius="md"
                                style={{ flex: 1, minWidth: 250 }}
                                leftSection={<IoSearch size={18} />}
                            />
                            <Tooltip label="Aggiungi nuovo utente" withArrow position="left">
                                <ActionIcon
                                    size="lg"
                                    radius="md"
                                    variant="filled"
                                    color="green"
                                    aria-label="Aggiungi nuovo utente"
                                    title="Aggiungi nuovo utente"
                                >
                                    <IoAdd size={20} />
                                </ActionIcon>
                            </Tooltip>
                        </Group>

                        {/* Users List */}
                        {filteredUsers.length > 0 ? (
                            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing="lg">
                                {filteredUsers.map((u) => (
                                    <Card
                                        key={u.uid}
                                        padding="md"
                                        radius="md"
                                        withBorder
                                        shadow="sm"
                                        className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                                        onClick={() => console.log("Visualizza dettagli:", u.uid)}
                                    >
                                        {/* Header con nome e tasti azioni */}
                                        <Group justify="space-between" mb="sm" wrap="nowrap">
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <Text fw={600} size="sm" truncate>
                                                    {u.name} {u.surname}
                                                </Text>
                                                <Text size="xs" c="dimmed" truncate>
                                                    @{u.nickname}
                                                </Text>
                                            </div>
                                            <Group gap={4} wrap="nowrap">
                                                <Menu shadow="md" width={140} position="bottom-end">
                                                    <Menu.Target>
                                                        <ActionIcon
                                                            variant="light"
                                                            size="sm"
                                                            radius="sm"
                                                            aria-label="Altre azioni"
                                                        >
                                                            ⋮
                                                        </ActionIcon>
                                                    </Menu.Target>
                                                    <Menu.Dropdown>
                                                        <Menu.Item onClick={() => console.log("Modifica:", u.uid)}>
                                                            <Group gap={8}>
                                                                <IoPencil size={16} />
                                                                <span>Modifica</span>
                                                            </Group>
                                                        </Menu.Item>
                                                        <Menu.Divider />
                                                        <Menu.Item color="red" onClick={() => console.log("Elimina:", u.uid)}>
                                                            <Group gap={8}>
                                                                <IoTrash size={16} />
                                                                <span>Elimina</span>
                                                            </Group>
                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            </Group>
                                        </Group>

                                        {/* Email con copy button */}
                                        <Stack gap={4} mb="sm">
                                            <Group gap={4} wrap="nowrap">
                                                <Text size="xs" fw={500} c="dimmed" style={{ flexShrink: 0 }}>
                                                    Email:
                                                </Text>
                                                <CopyButton value={u.email}>
                                                    {({ copied, copy }) => (
                                                        <Tooltip label={copied ? "Copiato!" : "Copia"} withArrow position="right">
                                                            <Text
                                                                size="xs"
                                                                c={copied ? "green" : "blue"}
                                                                className="cursor-pointer hover:underline truncate"
                                                                onClick={copy}
                                                            >
                                                                {u.email}
                                                            </Text>
                                                        </Tooltip>
                                                    )}
                                                </CopyButton>
                                            </Group>

                                            {/* Gruppo */}
                                            {u.group && (
                                                <Group gap={4} wrap="nowrap">
                                                    <Text size="xs" fw={500} c="dimmed" style={{ flexShrink: 0 }}>
                                                        Gruppo:
                                                    </Text>
                                                    <Badge size="xs" variant="light">
                                                        {u.group}
                                                    </Badge>
                                                </Group>
                                            )}
                                        </Stack>

                                        {/* Footer con ID */}
                                        <Group justify="space-between" pt="xs" style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}>
                                            <CopyButton value={u.uid}>
                                                {({ copied, copy }) => (
                                                    <Tooltip label={copied ? "Copiato!" : "Copia ID"} withArrow position="bottom">
                                                        <Text
                                                            size="xs"
                                                            c="dimmed"
                                                            className="cursor-pointer hover:text-blue-500 truncate"
                                                            onClick={copy}
                                                        >
                                                            ID: {u.uid}
                                                        </Text>
                                                    </Tooltip>
                                                )}
                                            </CopyButton>
                                        </Group>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        ) : (
                            <Center py="xl">
                                <Text c="dimmed">Nessun utente trovato</Text>
                            </Center>
                        )}
                    </Stack>
                </Tabs.Panel>

                <Tabs.Panel value="quiz" py="xl">
                    <Center py="xl">
                        <Text c="dimmed" size="lg">
                            Sezione Quiz in sviluppo
                        </Text>
                    </Center>
                </Tabs.Panel>

                <Tabs.Panel value="leaderboard" py="xl">
                    <Center py="xl">
                        <Text c="dimmed" size="lg">
                            Sezione Leaderboard in sviluppo
                        </Text>
                    </Center>
                </Tabs.Panel>
            </Tabs>
        </Container>
    )
}