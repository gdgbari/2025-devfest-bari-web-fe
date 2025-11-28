import { Modal, Stack, Button, Center, Text } from "@mantine/core";
import { useRef, type MutableRefObject } from "react";
import { QRCode } from "react-qrcode-logo";
import type { GetTagResponse } from "../../../utils/types";

interface TagQRCodeModalProps {
    opened: boolean;
    onClose: () => void;
    tag: GetTagResponse | null;
}

export function TagQRCodeModal({
    opened,
    onClose,
    tag,
}: TagQRCodeModalProps) {
    const qrCodeRef = useRef<QRCode>(null);

    if (!tag) return null;

    const handleDownload = () => {
        qrCodeRef.current?.download("png", `tag-${tag.tag_id}`);
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={`QR Code - ${tag.tag_id}`}
            size="auto"
            centered
        >
            <Stack gap="md" align="center">
                <Text size="sm" c="dimmed" ta="center">
                    Scansiona questo QR code per riscattare il tag ({tag.points} punti)
                </Text>

                <Center p="lg">
                    <QRCode
                        size={400}
                        value={`tag:${tag.secret}`}
                        logoImage="/assets/images/icons/icon-512x512.png"
                        ref={qrCodeRef as MutableRefObject<QRCode>}
                        qrStyle="fluid"
                        removeQrCodeBehindLogo
                        logoPaddingStyle="circle"
                        logoWidth={100}
                        eyeRadius={20}
                    />
                </Center>

                <Button fullWidth onClick={handleDownload} size="md">
                    Download QR Code
                </Button>

                <Text size="xs" c="dimmed" ta="center">
                    Tag ID: {tag.tag_id}
                </Text>
            </Stack>
        </Modal>
    );
}
