import { useState } from "react"
import {
    Stack,
    Group,
    Card,
    Text,
    Center,
    SimpleGrid,
    Badge,
    Avatar,
    Loader,
    Tabs,
} from "@mantine/core"
import { IoPersonOutline, IoPeopleOutline } from "react-icons/io5"
import { useLeaderboard } from "../../utils/requests"
import { useAllUsers } from "../../utils/query"
import { colorConverter } from "../../utils"
import { ViewUserModal } from "./modals/ViewUserModal"
import { UserCard } from "./components/UserCard"
import type { GetUserResponse } from "../../utils/types"
import { compareLeaderboardUsers } from "../../utils/sorting"

export const LeaderboardPanel = () => {
    const leaderboardData = useLeaderboard()
    const { data: usersData } = useAllUsers()
    const [selectedUser, setSelectedUser] = useState<GetUserResponse | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    if (!leaderboardData) {
        return (
            <Center py="xl">
                <Loader size="lg" />
            </Center>
        )
    }

    const users = leaderboardData.leaderboard_users
        ? Object.entries(leaderboardData.leaderboard_users)
            .map(([uid, user]) => ({ uid, ...user }))
            .sort(compareLeaderboardUsers)
        : []

    const groups = leaderboardData.leaderboard_groups
        ? Object.entries(leaderboardData.leaderboard_groups)
            .map(([gid, group]) => ({ gid, ...group }))
            .sort((a, b) => {
                // Prima ordina per score (decrescente)
                const scoreDiff = b.score - a.score
                if (scoreDiff !== 0) return scoreDiff

                // Se score uguale, ordina per updated_at (più recente prima)
                const timeDiff = b.updated_at - a.updated_at
                if (timeDiff !== 0) return timeDiff

                // Se anche il tempo è uguale, ordina per nome (alfabetico)
                return a.name.localeCompare(b.name)
            })
        : []

    const handleOpenUserModal = async (uid: string) => {
        // Recupera i dati della leaderboard per ottenere il nickname
        const leaderboardUser = leaderboardData?.leaderboard_users?.[uid]
        if (!leaderboardUser) return

        // Cerca l'utente completo nella lista usando il nickname univoco
        const fullUser = usersData?.users.find(u => u.nickname === leaderboardUser.nickname)

        if (fullUser) {
            setSelectedUser(fullUser)
            setIsViewModalOpen(true)
        }
    }

    const handleCloseUserModal = () => {
        setIsViewModalOpen(false)
        setSelectedUser(null)
    }

    // Helper per trovare il gruppo dall'utente
    const getGroupByColor = (color: string) => {
        return groups.find(g => g.color === color)
    }

    return (
        <Stack gap="lg">
            <Text size="xl" fw={700}>
                🏆 Classifiche
            </Text>

            <Tabs defaultValue="users" variant="pills">
                <Tabs.List mb="lg">
                    <Tabs.Tab
                        value="users"
                        leftSection={<IoPersonOutline size={18} />}
                    >
                        Utenti ({users.length})
                    </Tabs.Tab>
                    <Tabs.Tab
                        value="groups"
                        leftSection={<IoPeopleOutline size={18} />}
                    >
                        Gruppi ({groups.length})
                    </Tabs.Tab>
                </Tabs.List>

                {/* Tab Classifica Utenti */}
                <Tabs.Panel value="users">
                    {users.length > 0 ? (
                        <Stack gap="sm">
                            {users.map((user, index) => {
                                const userGroup = getGroupByColor(user.group_color)
                                return (
                                    <UserCard
                                        key={user.uid}
                                        user={user}
                                        position={index}
                                        groupName={userGroup?.name}
                                        onClick={() => handleOpenUserModal(user.uid)}
                                    />
                                )
                            })}
                        </Stack>
                    ) : (
                        <Center py="xl">
                            <Text c="dimmed">Nessun utente nella classifica</Text>
                        </Center>
                    )}
                </Tabs.Panel>

                {/* Tab Classifica Gruppi */}
                <Tabs.Panel value="groups">
                    {groups.length > 0 ? (
                        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="lg">
                            {groups.map((group, index) => {
                                const groupColor = colorConverter(group.color)
                                return (
                                    <Card
                                        key={group.gid}
                                        padding="lg"
                                        radius="md"
                                        withBorder
                                        shadow="md"
                                        style={{
                                            borderColor: groupColor,
                                            borderWidth: index < 3 ? 3 : 2,
                                        }}
                                    >
                                        <Stack gap="md" align="center">
                                            {index < 3 && (
                                                <Badge
                                                    size="xl"
                                                    variant="filled"
                                                    color={index === 0 ? 'yellow' : index === 1 ? 'gray' : 'orange'}
                                                >
                                                    {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                                                </Badge>
                                            )}
                                            <div
                                                style={{
                                                    width: 70,
                                                    height: 70,
                                                    borderRadius: '50%',
                                                    backgroundColor: groupColor,
                                                    boxShadow: `0 4px 16px ${groupColor}60`,
                                                    border: '4px solid white',
                                                }}
                                            />
                                            <div style={{ textAlign: 'center' }}>
                                                <Text fw={700} size="xl" mb={4}>
                                                    {group.name}
                                                </Text>
                                                <Text size="sm" c="dimmed" fw={500}>
                                                    Team {group.color}
                                                </Text>
                                            </div>
                                            <Badge
                                                size="xl"
                                                variant="filled"
                                                style={{
                                                    backgroundColor: groupColor,
                                                    color: 'white',
                                                }}
                                            >
                                                {group.score} punti
                                            </Badge>
                                            {index < 3 && (
                                                <Text size="sm" c="dimmed" fw={600}>
                                                    #{index + 1}° posizione
                                                </Text>
                                            )}
                                        </Stack>
                                    </Card>
                                )
                            })}
                        </SimpleGrid>
                    ) : (
                        <Center py="xl">
                            <Text c="dimmed">Nessun gruppo nella classifica</Text>
                        </Center>
                    )}
                </Tabs.Panel>
            </Tabs>

            {/* Modal dettagli utente */}
            <ViewUserModal
                user={selectedUser}
                opened={isViewModalOpen}
                onClose={handleCloseUserModal}
            />
        </Stack>
    )
}
