import { useState, useEffect } from "react";
import {
    Stack,
    Group,
    Text,
    Center,
    Button,
    NumberInput,
    Switch,
    Modal,
    Box,
    Container,
    Chip,
    MultiSelect,
    Loader,
} from "@mantine/core";
import { PiNavigationArrowDuotone } from "react-icons/pi";
import ConfettiExplosion from "react-confetti-explosion";
import { useLeaderboard } from "../../utils/requests";
import { useAllUsers } from "../../utils/query";
import { colorConverter, COLORS_LIST, shuffle, capitalizeFirstLetter } from "../../utils";
import type { LeaderBoardUser, GetUserResponse } from "../../utils/types";
import { ViewUserModal } from "./modals/ViewUserModal";
import { UserCard } from "./components/UserCard";

export const WheelPanel = () => {
    const leaderboardData = useLeaderboard();
    const { data: usersData } = useAllUsers();

    const [groupFilter, setGroupFilter] = useState<string[]>([]);
    const [usersToShow, setUsersToShow] = useState<number | null>(null);
    const [showWheel, setShowWheel] = useState(false);
    const [selectedUser, setSelectedUser] = useState<GetUserResponse | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [wheelStatus, setWheelStatus] = useState<"spinning" | "stopped" | "not-started">("not-started");
    const [spinningArray, setSpinningArray] = useState<LeaderBoardUser[]>([]);
    const [wheelTrigger, setWheelTrigger] = useState(false);
    const [lastSpeed, setLastSpeed] = useState(0);
    const [finalUserToSelect, setFinalUserToSelect] = useState(1);
    const [userToSelect, setUserToSelect] = useState(1);
    const [instantSpinning, setInstantSpinning] = useState(false);

    const borderUsers = 2;
    const usersInWheel = borderUsers * 2 + userToSelect;

    const groups = Object.values(leaderboardData?.leaderboard_groups ?? {});
    const users = Object.values(leaderboardData?.leaderboard_users ?? {});

    const groupByColor = (color: string) => {
        const res = groups.filter((group) => group.color === color);
        if (res.length === 0) return null;
        return res[0];
    };

    const sortLogic = (
        a: { score: number; updated_at: number; name: string },
        b: { score: number; updated_at: number; name: string }
    ) => {
        const diff_point = b.score - a.score;
        if (diff_point !== 0) return diff_point;
        const diff_time = b.updated_at - a.updated_at;
        if (diff_time !== 0) return diff_time;
        return a.name.localeCompare(b.name);
    };

    const filteredAndSortedUsers = users
        .filter((ele) => {
            if (groupFilter.length === 0) return true;
            const userGroup = groupByColor(ele.group_color);
            if (userGroup === null) return false;
            return groupFilter.includes(userGroup.name);
        })
        .sort((a, b) => sortLogic({ ...a, name: a.nickname }, { ...b, name: b.nickname }))
        .slice(0, usersToShow === null ? undefined : usersToShow);

    const isUserSelected = (userIndex: number): boolean => {
        // Se ci sono pochi utenti, i vincitori sono quelli centrali dell'array effettivo
        const actualArrayLength = spinningArray.length;
        if (actualArrayLength === 0) return false;

        // Se ci sono abbastanza utenti per i border, usa la logica originale
        if (actualArrayLength >= usersInWheel) {
            return userIndex - borderUsers < finalUserToSelect && userIndex - borderUsers >= 0;
        }

        // Altrimenti, i vincitori sono al centro dell'array disponibile
        const startIndex = Math.max(0, Math.floor((actualArrayLength - finalUserToSelect) / 2));
        const endIndex = Math.min(actualArrayLength, startIndex + finalUserToSelect);
        return userIndex >= startIndex && userIndex < endIndex;
    };

    useEffect(() => {
        if (wheelStatus === "spinning") {
            const copyOfArray = [...filteredAndSortedUsers];
            setFinalUserToSelect(userToSelect);
            // Prendi il minimo tra usersInWheel e gli utenti disponibili
            const arraySize = Math.min(usersInWheel, copyOfArray.length);
            setSpinningArray(shuffle(copyOfArray).slice(0, arraySize));
            setLastSpeed(0);
            setWheelTrigger(!wheelTrigger);
        }
    }, [wheelStatus]);

    useEffect(() => {
        setWheelStatus("not-started");
        setSpinningArray([]);
        setLastSpeed(0);
    }, [showWheel]);

    useEffect(() => {
        setInstantSpinning(false);
        setUserToSelect(1);
    }, [showWheel]);

    useEffect(() => {
        if (!showWheel || wheelStatus !== "spinning") return;
        setLastSpeed(lastSpeed + (lastSpeed < 80 ? 2 : lastSpeed < 150 ? 8 : lastSpeed < 300 ? 20 : 30));
        if (lastSpeed >= 500 || instantSpinning) {
            setWheelStatus("stopped");
            return;
        }
        let nextElement: LeaderBoardUser;
        while (true) {
            nextElement = shuffle([...filteredAndSortedUsers])[0];
            const elementToDelete = spinningArray[spinningArray.length - 1];
            if (nextElement === elementToDelete || !spinningArray.includes(nextElement)) break;
        }
        setSpinningArray((prev) => [nextElement, ...prev.slice(0, prev.length - 1)]);
        setTimeout(() => setWheelTrigger(!wheelTrigger), lastSpeed);
    }, [wheelTrigger]);

    const handleExportCSV = () => {
        const csv = filteredAndSortedUsers
            .map(
                (user, pos) =>
                    `${pos + 1},${user.nickname},${user.score},${user.updated_at},${groupByColor(user.group_color)?.name
                    }`
            )
            .join("\n");
        const blob = new Blob(["Position,Nickname,Score,LastSubmission,GroupName\n" + csv], {
            type: "text/csv",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "leaderboard.csv";
        a.click();
    };

    const handleOpenUserModal = (leaderboardUser: LeaderBoardUser) => {
        // Cerca l'utente completo nella lista usando il nickname univoco
        const fullUser = usersData?.users.find(u => u.nickname === leaderboardUser.nickname);

        if (fullUser) {
            setSelectedUser(fullUser);
            setIsViewModalOpen(true);
        }
    };

    const handleCloseUserModal = () => {
        setIsViewModalOpen(false);
        setSelectedUser(null);
    };

    if (!leaderboardData) {
        return (
            <Center py="xl">
                <Loader size="lg" />
            </Center>
        );
    }

    return (
        <Stack gap="lg">
            <Text size="xl" fw={700}>
                🎰 Wheel of Fortune
            </Text>

            {/* Filtri e Controlli */}
            <Group grow align="flex-start">
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
                />

                <NumberInput
                    label="Numero di utenti da visualizzare"
                    placeholder="Tutti"
                    value={usersToShow === null ? "" : usersToShow}
                    onChange={(v) => {
                        if (v === "" || v === null || v === undefined) {
                            setUsersToShow(null);
                        } else {
                            setUsersToShow(parseInt(v.toString()));
                        }
                    }}
                    min={1}
                    max={users.length}
                />
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

            {/* Anteprima utenti filtrati */}
            <Stack gap="sm">
                <Text size="lg" fw={600}>
                    Utenti selezionati ({filteredAndSortedUsers.length})
                </Text>
                {filteredAndSortedUsers.length > 0 ? (
                    filteredAndSortedUsers.slice(0, 10).map((user, i) => {
                        const userGroup = groupByColor(user.group_color);
                        return (
                            <UserCard
                                key={i}
                                user={user}
                                position={i}
                                groupName={userGroup?.name}
                                onClick={() => handleOpenUserModal(user)}
                            />
                        );
                    })
                ) : (
                    <Center py="xl">
                        <Text c="dimmed">Nessun utente trovato con i filtri selezionati</Text>
                    </Center>
                )}
                {filteredAndSortedUsers.length > 10 && (
                    <Text size="sm" c="dimmed" ta="center">
                        ... e altri {filteredAndSortedUsers.length - 10} utenti
                    </Text>
                )}
            </Stack>

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
                                    const userGroup = groupByColor(user.group_color);
                                    const isSelected = isUserSelected(i);
                                    // Mostra come perdente solo quando la ruota è ferma E l'utente non è selezionato
                                    const showAsLoser = wheelStatus === "stopped" && !isSelected;
                                    // Evidenzia come vincitore solo quando la ruota è ferma E l'utente è selezionato
                                    const showAsWinner = wheelStatus === "stopped" && isSelected;

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
                                                    onClick={isSelected && wheelStatus === "stopped" ? () => handleOpenUserModal(user) : undefined}
                                                />
                                            </Box>
                                        </Box>
                                    );
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
                                        setUserToSelect(1);
                                    } else {
                                        setUserToSelect(parseInt(v.toString()));
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
    );
};
