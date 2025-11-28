import { Modal, Stack, Button, Center, Text, Group, Badge } from "@mantine/core";
import { useRef, type MutableRefObject } from "react";
import { QRCode } from "react-qrcode-logo";
import type { GetUserResponse } from "../../../utils/types";
import { colorConverter } from "../../../utils";

interface UserQRCodeModalProps {
    opened: boolean;
    onClose: () => void;
    user: GetUserResponse | null;
}

export function UserQRCodeModal({
    opened,
    onClose,
    user,
}: UserQRCodeModalProps) {
    const qrCodeRef = useRef<QRCode>(null);

    if (!user) return null;

    const handleDownload = () => {
        qrCodeRef.current?.download("png", `user-${user.uid}`);
    };

    const groupColor = user.group ? colorConverter(user.group.color) : colorConverter("blue");

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text fw={700}>QR Code Utente</Text>}
            size="auto"
            centered
        >
            <Stack gap="md" align="center">
                <Group>
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            backgroundColor: groupColor,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "14px",
                        }}
                    >
                        {user.name?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                        <Text size="sm" fw={600}>
                            {user.name} {user.surname}
                        </Text>
                        <Text size="xs" c="dimmed">
                            @{user.nickname}
                        </Text>
                    </div>
                </Group>

                <Center p="lg" style={{ backgroundColor: "white", borderRadius: 16 }}>
                    <QRCode
                        size={300}
                        value={`user:${user.uid}`}
                        logoImage="/assets/images/icons/icon-512x512.png"
                        ref={qrCodeRef as MutableRefObject<QRCode>}
                        qrStyle="fluid"
                        removeQrCodeBehindLogo
                        logoPaddingStyle="circle"
                        logoWidth={80}
                        eyeRadius={10}
                    />
                </Center>

                <Button fullWidth onClick={handleDownload} size="md">
                    Scarica QR Code
                </Button>

                <Text size="xs" c="dimmed" ta="center" style={{ fontFamily: "monospace" }}>
                    ID: {user.uid}
                </Text>
            </Stack>
        </Modal>
    );
}
