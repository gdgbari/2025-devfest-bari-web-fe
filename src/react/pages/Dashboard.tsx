import type { UserProfile } from "../utils/types"
import { useState } from "react"
import {
    Container,
    Title,
    Tabs,
    Stack,
    Group,
    Badge,
    Center,
} from "@mantine/core"
import { IoPersonCircle } from "react-icons/io5"
import { UsersPanel } from "./dashboard/UsersPanel"
import { QuizzesPanel } from "./dashboard/QuizzesPanel"
import { LeaderboardPanel } from "./dashboard/LeaderboardPanel"
import { WheelPanel } from "./dashboard/WheelPanel"
import { QRScanPanel } from "./dashboard/QRScanPanel"
import { TagsPanel } from "./dashboard/TagsPanel"

type DashboardProps = {
    user: UserProfile
}

export const Dashboard = ({ user }: DashboardProps) => {
    const [activeTab, setActiveTab] = useState<string | null>('users')

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
                    <Tabs.Tab value="wheel">
                        Wheel of Fortune
                    </Tabs.Tab>
                    <Tabs.Tab value="qrscan">
                        QR Scanner
                    </Tabs.Tab>
                    <Tabs.Tab value="tags">
                        Tags
                    </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="users" py="xl">
                    <UsersPanel />
                </Tabs.Panel>

                <Tabs.Panel value="quiz" py="xl">
                    <QuizzesPanel />
                </Tabs.Panel>

                <Tabs.Panel value="leaderboard" py="xl">
                    <LeaderboardPanel />
                </Tabs.Panel>

                <Tabs.Panel value="wheel" py="xl">
                    <WheelPanel />
                </Tabs.Panel>

                <Tabs.Panel value="qrscan" py="xl">
                    <QRScanPanel isActive={activeTab === 'qrscan'} />
                </Tabs.Panel>

                <Tabs.Panel value="tags" py="xl">
                    <TagsPanel />
                </Tabs.Panel>
            </Tabs>
        </Container>
    )
}