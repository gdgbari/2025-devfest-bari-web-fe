import { Card, Group, Badge, Text, Stack, Tooltip } from "@mantine/core";
import { IoTrophy, IoPricetag } from "react-icons/io5";
import { colorConverter } from "../../../utils";
import type { LeaderBoardUser } from "../../../utils/types";

interface UserCardProps {
    user: LeaderBoardUser;
    position?: number;
    onClick?: () => void;
    isWinner?: boolean;
    hidePoints?: boolean;
    groupName?: string;
    showAsLoser?: boolean;
    tags?: { points: number; tag_id: string }[];
}

export const UserCard = ({ user, position, onClick, isWinner = false, hidePoints = false, groupName, showAsLoser = false, tags }: UserCardProps) => {
    const groupColor = colorConverter(user.group_color);

    return (
        <Card
            padding="md"
            radius="md"
            withBorder
            shadow={isWinner ? "xl" : "sm"}
            className={onClick ? "cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1" : ""}
            style={{
                borderLeftColor: isWinner ? "#FFD700" : groupColor,
                borderLeftWidth: "4px",
                borderLeftStyle: "solid",
                borderTopColor: isWinner ? "#FFD700" : undefined,
                borderRightColor: isWinner ? "#FFD700" : undefined,
                borderBottomColor: isWinner ? "#FFD700" : undefined,
                borderTopWidth: isWinner ? "2px" : undefined,
                borderRightWidth: isWinner ? "2px" : undefined,
                borderBottomWidth: isWinner ? "2px" : undefined,
                transition: "all 0.3s",
                backgroundColor: isWinner ? "rgba(255, 215, 0, 0.15)" : undefined,
                transform: isWinner ? "scale(1.02)" : undefined,
                opacity: showAsLoser ? 0.2 : 1,
            }}
            onClick={onClick}
        >
            <Group justify="space-between" wrap="nowrap">
                <Group gap="md">
                    {isWinner && <IoTrophy size={24} color="#FFD700" />}
                    {position !== undefined ? (
                        <Badge
                            size="xl"
                            variant="filled"
                            color={
                                position === 0
                                    ? "yellow"
                                    : position === 1
                                        ? "gray"
                                        : position === 2
                                            ? "orange"
                                            : "blue"
                            }
                            style={{ minWidth: 45, fontSize: '1.1rem', fontWeight: 700 }}
                        >
                            {position + 1}
                        </Badge>
                    ) : (
                        <div
                            style={{
                                width: 45,
                                height: 45,
                                borderRadius: "50%",
                                backgroundColor: groupColor,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                                fontWeight: "bold",
                            }}
                        >
                            {user.nickname[0].toUpperCase()}
                        </div>
                    )}
                    <Stack gap={2}>
                        <Text fw={600} style={{ textAlign: "left" }}>{user.nickname}</Text>
                        <Group gap={4}>
                            <div
                                style={{
                                    width: 14,
                                    height: 14,
                                    borderRadius: "50%",
                                    backgroundColor: groupColor,
                                }}
                            />
                            <Text size="sm" c="dimmed">
                                {groupName ? `Gruppo ${groupName}` : `Gruppo ${user.group_color}`}
                            </Text>
                            {tags && tags.length > 0 && (
                                <>
                                    <Text size="sm" c="dimmed"> • </Text>
                                    <Tooltip label={`${tags.length} tag${tags.length > 1 ? 's' : ''}`}>
                                        <Group gap={2} align="center">
                                            <IoPricetag size={12} color="gray" />
                                            <Text size="sm" c="dimmed">{tags.length}</Text>
                                        </Group>
                                    </Tooltip>
                                </>
                            )}
                        </Group>
                    </Stack>
                </Group>
                {!hidePoints && (
                    <Text fw={700} size="lg">
                        {user.score}
                    </Text>
                )}
            </Group>
        </Card>
    );
};
