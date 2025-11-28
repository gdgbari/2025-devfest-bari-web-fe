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
import { IoCamera, IoEye, IoQrCode, IoRemoveCircle } from "react-icons/io5";
import { FiCameraOff } from "react-icons/fi";
import { useAllUsers } from "../../utils/query";
import { colorConverter } from "../../utils";
import { ViewUserModal } from "./modals/ViewUserModal";
import { ScannedUsersActionsModal } from "./modals/ScannedUsersActionsModal";
import type { GetUserResponse } from "../../utils/types";
import { useQueryClient } from "@tanstack/react-query";

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
                        <IoRemoveCircle size={18} />
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
                    <Box display="flex" style={{ flexDirection: "column", justifyContent: "left" }}>
                        <Text fw={600} display="flex" >
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
                    </Box>
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
                    <Tooltip label="Deseleziona">
                        <ActionIcon color="red" variant="light" onClick={onRemove}>
                            <IoRemoveCircle size={18} />
                        </ActionIcon>
                    </Tooltip>
                </Group>
            </Group>
        </Card >
    );
};

export const QRScanPanel = ({ isActive = false }: { isActive?: boolean }) => {
    const [cameraEnabled, setCameraEnabled] = useState(true);
    const [scannedUsers, setScannedUsers] = useState<ScannedUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<GetUserResponse | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isActionsModalOpen, setIsActionsModalOpen] = useState(false);
    const { data: usersData } = useAllUsers();
    const queryClient = useQueryClient();

    // Usa un ref per tenere traccia degli utenti già scansionati
    const scannedUidsRef = useRef<Set<string>>(new Set());
    // Usa un set per tenere traccia dei tag già scansionati
    const scannedTagsRef = useRef<Set<string>>(new Set());

    const handleScan = (results: any[]) => {
        results.forEach((result) => {
            const rawValue = result.rawValue;

            // Handle user QR codes
            if (rawValue.startsWith("user:")) {
                const uid = rawValue.split(":")[1];

                // Verifica se l'UID è valido
                if (!uid || uid.trim() === "") {
                    console.warn("QR code con UID vuoto o invalido");
                    return;
                }

                // Usa il ref per verificare se è già stato scansionato
                if (scannedUidsRef.current.has(uid)) {
                    console.log("Utente già scansionato:", uid, Array.from(scannedUidsRef.current));
                    return;
                }

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

                // Aggiungi l'UID al ref
                scannedUidsRef.current.add(uid);

                setScannedUsers((prev) => [
                    { uid, scannedAt: new Date() },
                    ...prev,
                ]);

                console.log("Utente scansionato aggiunto:", uid, Array.from(scannedUidsRef.current));

                // Notifica di successo
                notifications.show({
                    title: "✅ Utente scansionato",
                    message: userName,
                    color: "green",
                    autoClose: 2000,
                });
            }
            // Handle tag QR codes
            else if (rawValue.startsWith("tag:")) {
                const secret = rawValue.split(":")[1];

                // Verifica se il secret è valido
                if (!secret || secret.trim() === "") {
                    console.warn("QR code con secret vuoto o invalido");
                    return;
                }

                // Verifica se è già stato scansionato
                if (scannedTagsRef.current.has(secret)) {
                    console.log("Tag già scansionato:", secret);
                    return;
                }

                // Aggiungi il secret al ref
                scannedTagsRef.current.add(secret);

                // Notifica di successo
                notifications.show({
                    title: "🏷️ Tag scansionato",
                    message: `Tag con secret: ${secret}`,
                    color: "blue",
                    autoClose: 3000,
                });

                // Se ci sono utenti scansionati, apri automaticamente il modal di azioni
                if (scannedUsers.length > 0) {
                    setIsActionsModalOpen(true);
                }
            }
        });
    };

    const handleRemoveUser = (uid: string) => {
        scannedUidsRef.current.delete(uid);
        setScannedUsers((prev) => prev.filter((u) => u.uid !== uid));
    };

    const handleViewUser = (user: GetUserResponse) => {
        setSelectedUser(user);
        setIsViewModalOpen(true);
    };

    const handleClearAll = () => {
        scannedUidsRef.current.clear();
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
                            <Group gap="xs">
                                <Button
                                    variant="filled"
                                    color="blue"
                                    onClick={() => setIsActionsModalOpen(true)}
                                >
                                    Gestisci Utenti
                                </Button>
                                <Button
                                    variant="light"
                                    color="red"
                                    leftSection={<IoRemoveCircle size={16} />}
                                    onClick={handleClearAll}
                                >
                                    Deseleziona tutto
                                </Button>
                            </Group>
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

            {/* Scanned Users Actions Modal */}
            <ScannedUsersActionsModal
                opened={isActionsModalOpen}
                onClose={() => setIsActionsModalOpen(false)}
                scannedUserIds={scannedUsers.map(u => u.uid)}
                onViewUser={handleViewUser}
                onRemoveUser={handleRemoveUser}
                onAssignmentComplete={() => {
                    // Invalidate queries to refresh user data
                    queryClient.invalidateQueries({ queryKey: ["users"] });
                }}
            />
        </Stack>
    );
};
