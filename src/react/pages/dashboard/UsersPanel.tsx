import { useState } from "react"
import {
    TextInput,
    Stack,
    Group,
    Card,
    Text,
    Center,
    ActionIcon,
    SimpleGrid,
    CopyButton,
    Tooltip,
    Menu,
    Loader,
    Modal,
    Button,
} from "@mantine/core"
import { IoAdd, IoPencil, IoTrash, IoSearch } from "react-icons/io5"
import { useAllUsers, useDeleteUser } from "../../utils/query"
import type { GetUserResponse } from "../../utils/types"
import { EditUserModal } from "./modals/EditUserModal"
import { CreateUserModal } from "./modals/CreateUserModal"
import { ViewUserModal } from "./modals/ViewUserModal"

export const UsersPanel = () => {
    const [query, setQuery] = useState("")
    const [selectedUser, setSelectedUser] = useState<GetUserResponse | null>(null)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [userToDelete, setUserToDelete] = useState<{ uid: string; name: string } | null>(null)

    const { data: usersData, isLoading, error } = useAllUsers()
    const deleteUserMutation = useDeleteUser()

    const handleOpenEditModal = (user: GetUserResponse) => {
        setSelectedUser(user)
        setIsEditModalOpen(true)
    }

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false)
        setSelectedUser(null)
    }

    const handleOpenViewModal = (user: GetUserResponse) => {
        setSelectedUser(user)
        setIsViewModalOpen(true)
    }

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false)
        setSelectedUser(null)
    }

    const handleOpenDeleteModal = (uid: string, name: string) => {
        setUserToDelete({ uid, name })
        setIsDeleteModalOpen(true)
    }

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setUserToDelete(null)
    }

    const handleConfirmDelete = async () => {
        if (!userToDelete) return

        try {
            await deleteUserMutation.mutateAsync(userToDelete.uid)
            handleCloseDeleteModal()
        } catch (error) {
            console.error("Errore nell'eliminazione:", error)
            alert("Errore nell'eliminazione dell'utente")
        }
    }

    const handleDeleteUser = async (uid: string, name: string) => {
        handleOpenDeleteModal(uid, name)
    }

    const filteredUsers = usersData?.users.filter(u => {
        const q = query.trim().toLowerCase()
        if (!q) return true
        return (
            u.name.toLowerCase().includes(q) ||
            u.surname.toLowerCase().includes(q) ||
            u.email.toLowerCase().includes(q) ||
            u.nickname.toLowerCase().includes(q) ||
            u.uid.toLowerCase().includes(q)
        )
    }) ?? []

    if (isLoading) {
        return (
            <Center py="xl">
                <Loader size="lg" />
            </Center>
        )
    }

    if (error) {
        return (
            <Center py="xl">
                <Text c="red">Errore nel caricamento degli utenti: {error.message}</Text>
            </Center>
        )
    }

    return (
        <Stack gap="lg">
            {/* Search Bar and Add Button */}
            <Group justify="space-between" wrap="wrap" gap="md">
                <TextInput
                    placeholder="Cerca per nome, email, nickname o ID..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    size="md"
                    radius="md"
                    style={{ flex: 1, minWidth: 250 }}
                    leftSection={<IoSearch size={18} />}
                />
                <Tooltip label="Aggiungi nuovo utente" withArrow position="left">
                    <ActionIcon
                        size="lg"
                        radius="md"
                        variant="filled"
                        color="green"
                        aria-label="Aggiungi nuovo utente"
                        title="Aggiungi nuovo utente"
                        onClick={() => setIsCreateModalOpen(true)}
                    >
                        <IoAdd size={20} />
                    </ActionIcon>
                </Tooltip>
            </Group>

            {/* Users List */}
            {filteredUsers.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing="lg">
                    {filteredUsers.map((u) => (
                        <Card
                            key={u.uid}
                            padding="md"
                            radius="md"
                            withBorder
                            shadow="sm"
                            className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
                            onClick={() => handleOpenViewModal(u)}
                        >
                            {/* Header con nome e tasti azioni */}
                            <Group justify="space-between" mb="sm" wrap="nowrap">
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <Text fw={600} size="sm" truncate>
                                        {u.name} {u.surname}
                                    </Text>
                                    <Text size="xs" c="dimmed" truncate>
                                        @{u.nickname}
                                    </Text>
                                </div>
                                <Group gap={4} wrap="nowrap">
                                    <Menu shadow="md" width={140} position="bottom-end">
                                        <Menu.Target>
                                            <ActionIcon
                                                variant="light"
                                                size="sm"
                                                radius="sm"
                                                aria-label="Altre azioni"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                ⋮
                                            </ActionIcon>
                                        </Menu.Target>
                                        <Menu.Dropdown>
                                            <Menu.Item
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleOpenEditModal(u)
                                                }}
                                            >
                                                <Group gap={8}>
                                                    <IoPencil size={16} />
                                                    <span>Modifica</span>
                                                </Group>
                                            </Menu.Item>
                                            <Menu.Divider />
                                            <Menu.Item
                                                color="red"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteUser(u.uid, `${u.name} ${u.surname}`)
                                                }}
                                            >
                                                <Group gap={8}>
                                                    <IoTrash size={16} />
                                                    <span>Elimina</span>
                                                </Group>
                                            </Menu.Item>
                                        </Menu.Dropdown>
                                    </Menu>
                                </Group>
                            </Group>

                            {/* Email con copy button */}
                            <Stack gap={4} mb="sm">
                                <Group gap={4} wrap="nowrap">
                                    <Text size="xs" fw={500} c="dimmed" style={{ flexShrink: 0 }}>
                                        Email:
                                    </Text>
                                    <CopyButton value={u.email}>
                                        {({ copied, copy }) => (
                                            <Tooltip label={copied ? "Copiato!" : "Copia"} withArrow position="right">
                                                <Text
                                                    size="xs"
                                                    c={copied ? "green" : "blue"}
                                                    className="cursor-pointer hover:underline truncate"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        copy()
                                                    }}
                                                >
                                                    {u.email}
                                                </Text>
                                            </Tooltip>
                                        )}
                                    </CopyButton>
                                </Group>

                                {/* Gruppo */}
                                {u.group && (
                                    <Group gap={6} wrap="nowrap">
                                        <Text size="xs" fw={500} c="dimmed" style={{ flexShrink: 0 }}>
                                            Gruppo:
                                        </Text>
                                        <Group gap={6} wrap="nowrap">
                                            <div
                                                style={{
                                                    width: 10,
                                                    height: 10,
                                                    borderRadius: '50%',
                                                    backgroundColor: u.group.color,
                                                    flexShrink: 0,
                                                }}
                                            />
                                            <Text size="xs" fw={500}>
                                                {u.group.name}
                                            </Text>
                                        </Group>
                                    </Group>
                                )}
                            </Stack>

                            {/* Footer con ID */}
                            <Group justify="space-between" pt="xs" style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}>
                                <CopyButton value={u.uid}>
                                    {({ copied, copy }) => (
                                        <Tooltip label={copied ? "Copiato!" : "Copia ID"} withArrow position="bottom">
                                            <Text
                                                size="xs"
                                                c="dimmed"
                                                className="cursor-pointer hover:text-blue-500 truncate"
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    copy()
                                                }}
                                            >
                                                ID: {u.uid}
                                            </Text>
                                        </Tooltip>
                                    )}
                                </CopyButton>
                            </Group>
                        </Card>
                    ))}
                </SimpleGrid>
            ) : (
                <Center py="xl">
                    <Text c="dimmed">Nessun utente trovato</Text>
                </Center>
            )}

            {/* Modals */}
            <ViewUserModal
                user={selectedUser}
                opened={isViewModalOpen}
                onClose={handleCloseViewModal}
            />
            <EditUserModal
                user={selectedUser}
                opened={isEditModalOpen}
                onClose={handleCloseEditModal}
            />
            <CreateUserModal
                opened={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />

            {/* Delete Confirmation Modal */}
            <Modal
                opened={isDeleteModalOpen}
                onClose={handleCloseDeleteModal}
                title="Conferma eliminazione"
                centered
            >
                <Stack gap="md">
                    <Group gap="xs">
                        <IoTrash size={24} color="red" />
                        <Text size="lg" fw={500}>
                            Sei sicuro di voler eliminare {userToDelete?.name}?
                        </Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                        Questa azione è irreversibile e l'utente verrà rimosso permanentemente dal sistema.
                    </Text>
                    <Group justify="flex-end" gap="sm">
                        <Button
                            variant="default"
                            onClick={handleCloseDeleteModal}
                        >
                            Annulla
                        </Button>
                        <Button
                            color="red"
                            onClick={handleConfirmDelete}
                            loading={deleteUserMutation.isPending}
                        >
                            Elimina
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Stack>
    )
}
