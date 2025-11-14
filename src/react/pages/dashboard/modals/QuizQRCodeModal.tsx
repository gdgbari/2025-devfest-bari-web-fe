import { Modal, Stack, Button, Center, Text } from "@mantine/core";
import { useRef, type MutableRefObject } from "react";
import { QRCode } from "react-qrcode-logo";

interface QuizQRCodeModalProps {
    opened: boolean;
    onClose: () => void;
    quizId: string | null;
    quizTitle: string | null;
}

export function QuizQRCodeModal({
    opened,
    onClose,
    quizId,
    quizTitle,
}: QuizQRCodeModalProps) {
    const qrCodeRef = useRef<QRCode>(null);

    if (!quizId) return null;

    const handleDownload = () => {
        qrCodeRef.current?.download("png", `quiz-${quizId}`);
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={`QR Code - ${quizTitle || quizId}`}
            size="auto"
            centered
        >
            <Stack gap="md" align="center">
                <Text size="sm" c="dimmed" ta="center">
                    Scansiona questo QR code per accedere al quiz
                </Text>

                <Center p="lg">
                    <QRCode
                        size={400}
                        value={`quiz:${quizId}`}
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
                    ID Quiz: {quizId}
                </Text>
            </Stack>
        </Modal>
    );
}
