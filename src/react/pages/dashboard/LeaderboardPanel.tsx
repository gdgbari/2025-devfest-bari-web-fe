import { useState, useEffect } from "react"
import {
    Stack,
    Group,
    Card,
    Text,
    Center,
    SimpleGrid,
    Badge,
    Tabs,
    Button,
    NumberInput,
    Switch,
    Modal,
    Box,
    Container,
    Chip,
    MultiSelect,
    Loader,
    Popover,
    Indicator,
    ActionIcon,
    Tooltip,
} from "@mantine/core"
import { IoPersonOutline, IoPeopleOutline, IoFilter, IoRefresh } from "react-icons/io5"
import { PiNavigationArrowDuotone } from "react-icons/pi"
import ConfettiExplosion from "react-confetti-explosion"
import { useLeaderboard } from "../../utils/requests"
import { useAllUsers, useAllTags } from "../../utils/query"
import { colorConverter, COLORS_LIST, shuffle, capitalizeFirstLetter } from "../../utils"
import { ViewUserModal } from "./modals/ViewUserModal"
import { UserCard } from "./components/UserCard"
import type { GetUserResponse, LeaderBoardUser } from "../../utils/types"
import { compareLeaderboardUsers } from "../../utils/sorting"

export const LeaderboardPanel = () => {
    const leaderboardData = useLeaderboard()
    const { data: usersData } = useAllUsers()
    const { data: tagsData } = useAllTags()
    const [selectedUser, setSelectedUser] = useState<GetUserResponse | null>(null)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)

    // Wheel State
    const [groupFilter, setGroupFilter] = useState<string[]>([])
    const [tagFilter, setTagFilter] = useState<string[]>([])
    const [tagExcludeFilter, setTagExcludeFilter] = useState<string[]>([])
    const [usersToShow, setUsersToShow] = useState<number | null>(null)
    const [showWheel, setShowWheel] = useState(false)
    const [wheelStatus, setWheelStatus] = useState<"spinning" | "stopped" | "not-started">("not-started")
    const [spinningArray, setSpinningArray] = useState<LeaderBoardUser[]>([])
    const [wheelTrigger, setWheelTrigger] = useState(false)
    const [lastSpeed, setLastSpeed] = useState(0)
    const [finalUserToSelect, setFinalUserToSelect] = useState(1)
    const [userToSelect, setUserToSelect] = useState(1)
    const [instantSpinning, setInstantSpinning] = useState(false)

    const borderUsers = 2
    const usersInWheel = borderUsers * 2 + userToSelect

    const groups = leaderboardData?.leaderboard_groups
        ? Object.entries(leaderboardData.leaderboard_groups)
            .map(([gid, group]) => ({ gid, ...group }))
            .sort((a, b) => {
                const scoreDiff = b.score - a.score
                if (scoreDiff !== 0) return scoreDiff
                const timeDiff = b.updated_at - a.updated_at
                if (timeDiff !== 0) return timeDiff
                return a.name.localeCompare(b.name)
            })
        : []

    // Helper per trovare il gruppo dall'utente
    const getGroupByColor = (color: string) => {
        return groups.find(g => g.color === color)
    }

    const users = leaderboardData?.leaderboard_users
        ? Object.entries(leaderboardData.leaderboard_users)
            .map(([uid, user]) => ({ uid, ...user }))
        : []

    const filteredAndSortedUsers = users
        .filter((ele) => {
            // Filtro per gruppo
            if (groupFilter.length > 0) {
                const userGroup = getGroupByColor(ele.group_color)
                if (!userGroup || !groupFilter.includes(userGroup.name)) return false
            }

            // Filtro per tag (Inclusione ed Esclusione)
            if (tagFilter.length > 0 || tagExcludeFilter.length > 0) {
                const fullUser = usersData?.users.find(u => u.nickname === ele.nickname)
                if (!fullUser) return false // Se non troviamo l'utente completo, non possiamo verificare i tag

                const userTags = fullUser.tags?.map(t => t.tag_id) || []

                // Inclusione: Verifica se l'utente ha ALMENO UNO dei tag selezionati
                if (tagFilter.length > 0) {
                    const hasSelectedTag = tagFilter.some(tag => userTags.includes(tag))
                    if (!hasSelectedTag) return false
                }

                // Esclusione: Verifica se l'utente ha ALMENO UNO dei tag esclusi
                if (tagExcludeFilter.length > 0) {
                    const hasExcludedTag = tagExcludeFilter.some(tag => userTags.includes(tag))
                    if (hasExcludedTag) return false
                }
            }

            return true
        })
        .sort(compareLeaderboardUsers)
        .slice(0, usersToShow === null ? undefined : usersToShow)

    const isUserSelected = (userIndex: number): boolean => {
        const actualArrayLength = spinningArray.length
        if (actualArrayLength === 0) return false

        if (actualArrayLength >= usersInWheel) {
            return userIndex - borderUsers < finalUserToSelect && userIndex - borderUsers >= 0
        }

        const startIndex = Math.max(0, Math.floor((actualArrayLength - finalUserToSelect) / 2))
        const endIndex = Math.min(actualArrayLength, startIndex + finalUserToSelect)
        return userIndex >= startIndex && userIndex < endIndex
    }

    useEffect(() => {
        if (wheelStatus === "spinning") {
            const copyOfArray = [...filteredAndSortedUsers]
            setFinalUserToSelect(userToSelect)
            const arraySize = Math.min(usersInWheel, copyOfArray.length)
            setSpinningArray(shuffle(copyOfArray).slice(0, arraySize))
            setLastSpeed(0)
            setWheelTrigger(!wheelTrigger)
        }
    }, [wheelStatus])

    useEffect(() => {
        setWheelStatus("not-started")
        setSpinningArray([])
        setLastSpeed(0)
    }, [showWheel])

    useEffect(() => {
        setInstantSpinning(false)
        setUserToSelect(1)
    }, [showWheel])

    useEffect(() => {
        if (!showWheel || wheelStatus !== "spinning") return
        setLastSpeed(lastSpeed + (lastSpeed < 80 ? 2 : lastSpeed < 150 ? 8 : lastSpeed < 300 ? 20 : 30))
        if (lastSpeed >= 500 || instantSpinning) {
            setWheelStatus("stopped")
            return
        }
        let nextElement: LeaderBoardUser
        while (true) {
            nextElement = shuffle([...filteredAndSortedUsers])[0]
            const elementToDelete = spinningArray[spinningArray.length - 1]
            if (nextElement === elementToDelete || !spinningArray.includes(nextElement)) break
        }
        setSpinningArray((prev) => [nextElement, ...prev.slice(0, prev.length - 1)])
        setTimeout(() => setWheelTrigger(!wheelTrigger), lastSpeed)
    }, [wheelTrigger])

    const handleExportCSV = () => {
        const csv = filteredAndSortedUsers
            .map(
                (user, pos) =>
                    `${pos + 1},${user.nickname},${user.score},${user.updated_at},${getGroupByColor(user.group_color)?.name
                    }`
            )
            .join("\n")
        const blob = new Blob(["Position,Nickname,Score,LastSubmission,GroupName\n" + csv], {
            type: "text/csv",
        })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "leaderboard.csv"
        a.click()
    }

    const handleOpenUserModal = async (userOrUid: string | LeaderBoardUser) => {
        let nickname: string | undefined

        if (typeof userOrUid === 'string') {
            const leaderboardUser = leaderboardData?.leaderboard_users?.[userOrUid]
            nickname = leaderboardUser?.nickname
        } else {
            nickname = userOrUid.nickname
        }

        if (!nickname) return

        const fullUser = usersData?.users.find(u => u.nickname === nickname)

        if (fullUser) {
            setSelectedUser(fullUser)
            setIsViewModalOpen(true)
        }
    }

    const handleCloseUserModal = () => {
        setIsViewModalOpen(false)
        setSelectedUser(null)
    }

    if (!leaderboardData) {
        return (
            <Center py="xl">
                <Loader size="lg" />
            </Center>
        )
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
                        Utenti ({filteredAndSortedUsers.length})
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
                    <Stack gap="md">
                        {/* Filtri e Controlli */}
                        <Card withBorder radius="md" padding="md">
                            <Group justify="space-between" align="flex-end">
                                <Group align="flex-end">
                                    <MultiSelect
                                        label="Filtra per gruppi"
                                        placeholder="Seleziona gruppi..."
                                        data={groups.map((group) => ({
                                            value: group.name,
                                            label: capitalizeFirstLetter(group.name),
                                        }))}
                                        searchable
                                        value={groupFilter}
                                        onChange={setGroupFilter}
                                        style={{ width: 200 }}
                                    />

                                    <Popover width={300} position="bottom" withArrow shadow="md">
                                        <Popover.Target>
                                            <Indicator
                                                inline
                                                label={tagFilter.length + tagExcludeFilter.length}
                                                size={16}
                                                disabled={tagFilter.length === 0 && tagExcludeFilter.length === 0}
                                            >
                                                <Button variant="default" leftSection={<IoFilter size={18} />}>
                                                    Filtra Tags
                                                </Button>
                                            </Indicator>
                                        </Popover.Target>
                                        <Popover.Dropdown>
                                            <Stack gap="sm">
                                                <MultiSelect
                                                    label="Includi tag"
                                                    placeholder="Seleziona tag..."
                                                    data={tagsData?.tags.map((tag) => ({
                                                        value: tag.tag_id,
                                                        label: tag.tag_id,
                                                    })) || []}
                                                    searchable
                                                    value={tagFilter}
                                                    onChange={setTagFilter}
                                                />
                                                <MultiSelect
                                                    label="Escludi tag"
                                                    placeholder="Seleziona tag..."
                                                    data={tagsData?.tags.map((tag) => ({
                                                        value: tag.tag_id,
                                                        label: tag.tag_id,
                                                    })) || []}
                                                    searchable
                                                    value={tagExcludeFilter}
                                                    onChange={setTagExcludeFilter}
                                                />
                                            </Stack>
                                        </Popover.Dropdown>
                                    </Popover>

                                    <NumberInput
                                        label="Utenti visibili"
                                        placeholder="Tutti"
                                        value={usersToShow === null ? "" : usersToShow}
                                        onChange={(v) => {
                                            if (v === "" || v === null || v === undefined) {
                                                setUsersToShow(null)
                                            } else {
                                                setUsersToShow(parseInt(v.toString()))
                                            }
                                        }}
                                        min={1}
                                        max={users.length}
                                        style={{ width: 120 }}
                                    />

                                    {(groupFilter.length > 0 || tagFilter.length > 0 || tagExcludeFilter.length > 0 || usersToShow !== null) && (
                                        <Tooltip label="Resetta filtri">
                                            <ActionIcon
                                                variant="light"
                                                color="red"
                                                size="lg"
                                                onClick={() => {
                                                    setGroupFilter([])
                                                    setTagFilter([])
                                                    setTagExcludeFilter([])
                                                    setUsersToShow(null)
                                                }}
                                            >
                                                <IoRefresh size={20} />
                                            </ActionIcon>
                                        </Tooltip>
                                    )}
                                </Group>

                                {/* Pulsanti Azione */}
                                <Group>
                                    <Button size="md" onClick={() => setShowWheel(true)} disabled={filteredAndSortedUsers.length === 0}>
                                        🎡 Avvia Wheel of Fortune
                                    </Button>
                                    <Button size="md" variant="outline" onClick={handleExportCSV}>
                                        📊 Esporta CSV
                                    </Button>
                                </Group>
                            </Group>
                        </Card>

                        {filteredAndSortedUsers.length > 0 ? (
                            <Stack gap="sm">
                                {filteredAndSortedUsers.map((user, index) => {
                                    const userGroup = getGroupByColor(user.group_color)
                                    const fullUser = usersData?.users.find(u => u.nickname === user.nickname)
                                    return (
                                        <UserCard
                                            key={index}
                                            user={user}
                                            position={index}
                                            groupName={userGroup?.name}
                                            tags={fullUser?.tags}
                                            onClick={() => handleOpenUserModal(user)}
                                        />
                                    )
                                })}
                            </Stack>
                        ) : (
                            <Center py="xl">
                                <Text c="dimmed">Nessun utente trovato con i filtri selezionati</Text>
                            </Center>
                        )}
                        {filteredAndSortedUsers.length > (usersToShow || Infinity) && (
                            <Text size="sm" c="dimmed" ta="center">
                                ... e altri {filteredAndSortedUsers.length - (usersToShow || 0)} utenti
                            </Text>
                        )}
                    </Stack>
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

            {/* Modal Wheel of Fortune */}
            <Modal
                opened={showWheel}
                onClose={() => setShowWheel(false)}
                fullScreen
                title={<Text size="xl" fw={700}>🍀 Wheel of Fortune</Text>}
            >
                <Stack gap="lg" align="center">
                    {wheelStatus === "stopped" && (
                        <Box style={{ position: "absolute", top: 0, left: 0, width: "100%", display: "flex", justifyContent: "center" }}>
                            <ConfettiExplosion
                                colors={COLORS_LIST.map((ele) => colorConverter(ele))}
                                zIndex={10000}
                                width={4000}
                                height={"350vh"}
                            />
                        </Box>
                    )}

                    {/* Filtri applicati */}
                    <Group>
                        {usersToShow !== null && <Chip>Top {usersToShow} utenti</Chip>}
                        {groupFilter.length > 0 && (
                            <Chip>Gruppi: {groupFilter.map((ele) => capitalizeFirstLetter(ele)).join(", ")}</Chip>
                        )}
                        {tagFilter.length > 0 && (
                            <Chip>Tags (Inclusi): {tagFilter.join(", ")}</Chip>
                        )}
                        {tagExcludeFilter.length > 0 && (
                            <Chip color="red">Tags (Esclusi): {tagExcludeFilter.join(", ")}</Chip>
                        )}
                    </Group>

                    {/* Ruota */}
                    {wheelStatus !== "not-started" && (
                        <Stack gap="md" align="center" style={{ width: "100%", marginTop: 40, marginBottom: 40 }}>
                            {wheelStatus === "spinning" && (
                                <Text size="xl" fw={700}>
                                    Estrazione in corso...
                                </Text>
                            )}
                            {wheelStatus === "stopped" && (
                                <Text size="xl" fw={700}>
                                    🎉 {finalUserToSelect > 1 ? "I vincitori sono" : "Il vincitore è"} ...
                                </Text>
                            )}
                            <Container size="sm" style={{ width: "100%" }}>
                                {spinningArray.map((user, i) => {
                                    const userGroup = getGroupByColor(user.group_color)
                                    const isSelected = isUserSelected(i)
                                    // Mostra come perdente solo quando la ruota è ferma E l'utente non è selezionato
                                    const showAsLoser = wheelStatus === "stopped" && !isSelected
                                    // Evidenzia come vincitore solo quando la ruota è ferma E l'utente è selezionato
                                    const showAsWinner = wheelStatus === "stopped" && isSelected
                                    const fullUser = usersData?.users.find(u => u.nickname === user.nickname)

                                    return (
                                        <Box key={i} style={{ display: "flex", alignItems: "center", marginBottom: 10 }}>
                                            <Box style={{ width: 80, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                                {isSelected && wheelStatus === "stopped" && (
                                                    <PiNavigationArrowDuotone style={{ rotate: "135deg" }} size={40} />
                                                )}
                                            </Box>
                                            <Box style={{ flex: 1 }}>
                                                <UserCard
                                                    user={user}
                                                    hidePoints
                                                    groupName={userGroup?.name}
                                                    isWinner={showAsWinner}
                                                    showAsLoser={showAsLoser}
                                                    tags={fullUser?.tags}
                                                    onClick={isSelected && wheelStatus === "stopped" ? () => handleOpenUserModal(user) : undefined}
                                                />
                                            </Box>
                                        </Box>
                                    )
                                })}
                            </Container>
                        </Stack>
                    )}

                    {/* Controlli */}
                    <Group>
                        {wheelStatus !== "spinning" && (
                            <NumberInput
                                label="Numero di utenti da estrarre"
                                value={userToSelect}
                                onChange={(v) => {
                                    if (v === "" || v === null || v === undefined) {
                                        setUserToSelect(1)
                                    } else {
                                        setUserToSelect(parseInt(v.toString()))
                                    }
                                }}
                                min={1}
                                max={Math.max(1, filteredAndSortedUsers.length)}
                            />
                        )}
                        {wheelStatus !== "spinning" && (
                            <Switch
                                label="Estrazione istantanea ™️"
                                checked={instantSpinning}
                                onChange={(v) => setInstantSpinning(v.target.checked)}
                                style={{ marginTop: 25 }}
                            />
                        )}
                    </Group>

                    {/* Pulsante Spin */}
                    <Button
                        size="lg"
                        onClick={() => setWheelStatus("spinning")}
                        disabled={wheelStatus === "spinning" || filteredAndSortedUsers.length === 0}
                        style={{ marginTop: 20, marginBottom: 40 }}
                    >
                        {wheelStatus === "stopped" ? "🔄 Gira di nuovo" : "🎰 Gira la ruota"}
                    </Button>
                </Stack>
            </Modal>

            {/* Modal dettagli utente */}
            <ViewUserModal
                user={selectedUser}
                opened={isViewModalOpen}
                onClose={handleCloseUserModal}
            />
        </Stack>
    )
}
