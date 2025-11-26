import { useState, useRef } from "react";
import {
    Stack,
    Text,
    Button,
    Card,
    Group,
    Badge,
    Switch,
    Box,
    Center,
    Loader,
    Divider,
    ActionIcon,
    Tooltip,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { Scanner } from "@yudiel/react-qr-scanner";
import { IoCamera, IoTrash, IoEye, IoQrCode } from "react-icons/io5";
import { FiCameraOff } from "react-icons/fi";
import { useAllUsers } from "../../utils/query";
import { colorConverter } from "../../utils";
import { ViewUserModal } from "./modals/ViewUserModal";
import type { GetUserResponse } from "../../utils/types";

interface ScannedUser {
    uid: string;
    scannedAt: Date;
}

const ScannedUserCard = ({
    uid,
    onRemove,
    onView,
}: {
    uid: string;
    onRemove: () => void;
    onView: (user: GetUserResponse) => void;
}) => {
    const { data: usersData, isLoading } = useAllUsers();
    const user = usersData?.users.find(u => u.uid === uid);

    if (isLoading) {
        return (
            <Card padding="md" radius="md" withBorder shadow="sm">
                <Group justify="center">
                    <Loader size="sm" />
                    <Text size="sm">Caricamento...</Text>
                </Group>
            </Card>
        );
    }

    if (!user) {
        return (
            <Card padding="md" radius="md" withBorder shadow="sm">
                <Group justify="space-between">
                    <Text c="red" size="sm">
                        Utente non trovato: {uid}
                    </Text>
                    <ActionIcon color="red" variant="light" onClick={onRemove}>
                        <IoTrash size={18} />
                    </ActionIcon>
                </Group>
            </Card>
        );
    }

    const groupColor = user.group ? colorConverter(user.group.color) : colorConverter("blue");

    return (
        <Card
            padding="md"
            radius="md"
            withBorder
            shadow="sm"
            className="hover:shadow-md transition-all"
            style={{
                borderLeft: `4px solid ${groupColor}`,
            }}
        >
            <Group justify="space-between" wrap="nowrap">
                <Group gap="md">
                    <div
                        style={{
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            backgroundColor: groupColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "18px",
                        }}
                    >
                        {user.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                        <Text fw={600}>
                            {user.name} {user.surname}
                        </Text>
                        <Group gap={8}>
                            <Text size="sm" c="dimmed">
                                @{user.nickname}
                            </Text>
                            <Badge size="sm" variant="light">
                                {user.email}
                            </Badge>
                        </Group>
                    </div>
                </Group>
                <Group gap="xs">
                    <Tooltip label="Visualizza dettagli">
                        <ActionIcon
                            color="blue"
                            variant="light"
                            onClick={() => onView(user)}
                        >
                            <IoEye size={18} />
                        </ActionIcon>
                    </Tooltip>
                    <Tooltip label="Rimuovi">
                        <ActionIcon color="red" variant="light" onClick={onRemove}>
                            <IoTrash size={18} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>
        </Card>
    );
};

export const QRScanPanel = ({ isActive = false }: { isActive?: boolean }) => {
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [scannedUsers, setScannedUsers] = useState<ScannedUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<GetUserResponse | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const { data: usersData } = useAllUsers();

    // Track last scan time for each UID to prevent rapid re-scans
    const lastScanTimes = useRef<Map<string, number>>(new Map());
    const COOLDOWN_MS = 5000; // 5 seconds cooldown

    const handleScan = (results: any[]) => {
        results.forEach((result) => {
            if (!result.rawValue.startsWith("user:")) {
                return;
            }

            const uid = result.rawValue.split(":")[1];

            // Verifica se l'UID è valido
            if (!uid || uid.trim() === "") {
                console.warn("QR code con UID vuoto o invalido");
                return;
            }

            // Check cooldown period
            const now = Date.now();
            const lastScanTime = lastScanTimes.current.get(uid);

            if (lastScanTime && (now - lastScanTime) < COOLDOWN_MS) {
                // Still in cooldown, ignore silently
                return;
            }

            const alreadyScanned = scannedUsers.some((u) => u.uid === uid);

            // Se è già stato scansionato, ignora completamente
            if (alreadyScanned) {
                return;
            }

            // Update last scan time
            lastScanTimes.current.set(uid, now);

            // Cerca l'utente nel backend
            const user = usersData?.users.find(u => u.uid === uid);

            // Se l'utente non esiste nel backend, mostra una notifica di errore e non aggiungerlo
            if (!user) {
                notifications.show({
                    title: "⚠️ Utente non trovato",
                    message: `L'utente con ID ${uid} non esiste nel sistema`,
                    color: "red",
                    autoClose: 3000,
                });
                return;
            }

            const userName = `${user.name} ${user.surname} (@${user.nickname})`;

            setScannedUsers((prev) => [
                { uid, scannedAt: new Date() },
                ...prev,
            ]);

            // Notifica di successo
            notifications.show({
                title: "✅ Utente scansionato",
                message: userName,
                color: "green",
                autoClose: 2000,
            });
        });
    };

    const handleRemoveUser = (uid: string) => {
        setScannedUsers((prev) => prev.filter((u) => u.uid !== uid));
    };

    const handleViewUser = (user: GetUserResponse) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const handleClearAll = () => {
        setScannedUsers([]);
    };

    return (
        <Stack gap="lg">
            <Group justify="space-between" align="center">
                <Text size="xl" fw={700}>
                    📱 QR Scanner
                </Text>
                <Switch
                    label="Camera"
                    checked={cameraEnabled}
                    onChange={(e) => setCameraEnabled(e.currentTarget.checked)}
                    onLabel={<IoCamera size={16} />}
                    offLabel={<FiCameraOff size={16} />}
                    size="lg"
                />
            </Group>

            {/* Scanner Section */}
            <Card padding="lg" radius="md" withBorder shadow="sm">
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Text size="lg" fw={600}>
                            Scanner QR Code
                        </Text>
                        <Badge
                            size="lg"
                            variant="dot"
                            color={cameraEnabled ? "green" : "red"}
                        >
                            {cameraEnabled ? "Attiva" : "Disattivata"}
                        </Badge>
                    </Group>

                    <Divider />

                    <Center>
                        <Box style={{ maxWidth: 400, width: "100%" }}>
                            {cameraEnabled && isActive ? (
                                <Scanner
                                    onScan={handleScan}
                                    allowMultiple
                                    components={{
                                        onOff: false,
                                        finder: true,
                                        torch: true,
                                    }}
                                />
                            ) : (
                                <Center p="xl">
                                    <Stack align="center" gap="md">
                                        <FiCameraOff size={64} opacity={0.3} />
                                        <Text c="dimmed" size="sm" ta="center">
                                            {!isActive
                                                ? "Seleziona il tab QR Scanner per attivare la camera"
                                                : "Camera disattivata"
                                            }
                                            <br />
                                            {isActive && "Attiva la camera per scansionare i QR code"}
                                        </Text>
                                    </Stack>
                                </Center>
                            )}
                        </Box>
                    </Center>

                    <Text size="xs" c="dimmed" ta="center">
                        <IoQrCode size={16} style={{ display: "inline", marginRight: 4 }} />
                        Scansiona i QR code degli utenti per visualizzare i loro dettagli
                    </Text>
                </Stack>
            </Card>

            {/* Scanned Users Section */}
            <Card padding="lg" radius="md" withBorder shadow="sm">
                <Stack gap="md">
                    <Group justify="space-between" align="center">
                        <Text size="lg" fw={600}>
                            Utenti scansionati ({scannedUsers.length})
                        </Text>
                        {scannedUsers.length > 0 && (
                            <Button
                                variant="light"
                                color="red"
                                leftSection={<IoTrash size={16} />}
                                onClick={handleClearAll}
                            >
                                Cancella tutto
                            </Button>
                        )}
                    </Group>

                    <Divider />

                    {scannedUsers.length === 0 ? (
                        <Center py="xl">
                            <Stack align="center" gap="md">
                                <IoQrCode size={64} opacity={0.3} />
                                <Text c="dimmed" size="sm" ta="center">
                                    Nessun utente scansionato
                                    <br />
                                    Inizia a scansionare i QR code per visualizzare gli utenti
                                </Text>
                            </Stack>
                        </Center>
                    ) : (
                        <Stack gap="sm">
                            {scannedUsers.map((scannedUser) => (
                                <ScannedUserCard
                                    key={scannedUser.uid}
                                    uid={scannedUser.uid}
                                    onRemove={() => handleRemoveUser(scannedUser.uid)}
                                    onView={handleViewUser}
                                />
                            ))}
                        </Stack>
                    )}
                </Stack>
            </Card>

            {/* User Details Modal */}
            <ViewUserModal
                user={selectedUser}
                opened={isViewModalOpen}
                onClose={() => {
                    setIsViewModalOpen(false);
                    setSelectedUser(null);
                }}
            />
        </Stack>
    );
};
