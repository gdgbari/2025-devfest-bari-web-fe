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
    Loader,
    Modal,
    Button,
    NumberInput,
    Badge,
    Tooltip,
    Menu,
} from "@mantine/core"
import { IoAdd, IoPencil, IoTrash, IoSearch, IoPricetag } from "react-icons/io5"
import { notifications } from "@mantine/notifications"
import { useAllTags } from "../../utils/query"
import type { GetTagResponse } from "../../utils/types"

export const TagsPanel = () => {
    const [query, setQuery] = useState("")
    const [opened, setOpened] = useState(false)
    const [editingTag, setEditingTag] = useState<GetTagResponse | null>(null)
    const [tagId, setTagId] = useState("")
    const [points, setPoints] = useState<number | string>(10)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [tagToDelete, setTagToDelete] = useState<{ tag_id: string; points: number } | null>(null)

    const { data: tagsData, isLoading, error, refetch } = useAllTags()
    const [submitting, setSubmitting] = useState(false)

    const handleOpenModal = (tag?: GetTagResponse) => {
        if (tag) {
            setEditingTag(tag)
            setTagId(tag.tag_id)
            setPoints(tag.points)
        } else {
            setEditingTag(null)
            setTagId("")
            setPoints(10)
        }
        setOpened(true)
    }

    const handleSubmit = async () => {
        if (!tagId) return

        setSubmitting(true)
        try {
            const { createTagRequest, updateTagRequest } = await import("../../utils/requests")

            if (editingTag) {
                await updateTagRequest(editingTag.tag_id, { points: Number(points) })
                notifications.show({
                    title: "✅ Successo",
                    message: "Tag aggiornato correttamente",
                    color: "green",
                    autoClose: 2000,
                })
            } else {
                await createTagRequest({ tag_id: tagId, points: Number(points) })
                notifications.show({
                    title: "✅ Successo",
                    message: "Tag creato correttamente",
                    color: "green",
                    autoClose: 2000,
                })
            }
            setOpened(false)
            refetch()
        } catch (error) {
            console.error(error)
            notifications.show({
                title: "❌ Errore",
                message: "Operazione fallita",
                color: "red",
                autoClose: 3000,
            })
        } finally {
            setSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!tagToDelete) return

        try {
            const { deleteTagRequest } = await import("../../utils/requests")
            await deleteTagRequest(tagToDelete.tag_id)
            notifications.show({
                title: "✅ Successo",
                message: "Tag eliminato correttamente",
                color: "green",
                autoClose: 2000,
            })
            refetch()
            setIsDeleteModalOpen(false)
            setTagToDelete(null)
        } catch (error) {
            console.error(error)
            notifications.show({
                title: "❌ Errore",
                message: "Impossibile eliminare il tag",
                color: "red",
                autoClose: 3000,
            })
        }
    }

    const filteredTags = tagsData?.tags.filter(tag => {
        const q = query.trim().toLowerCase()
        if (!q) return true
        return tag.tag_id.toLowerCase().includes(q) || tag.points.toString().includes(q)
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
                <Text c="red">Errore nel caricamento dei tag: {error.message}</Text>
            </Center>
        )
    }

    return (
        <Stack gap="lg">
            {/* Search Bar and Add Button */}
            <Card withBorder radius="md" padding="md">
                <Group justify="space-between" wrap="wrap" gap="md">
                    <TextInput
                        placeholder="Cerca per ID o punti..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        size="md"
                        radius="md"
                        style={{ flex: 1, minWidth: 250 }}
                        leftSection={<IoSearch size={18} />}
                    />
                    <Button
                        size="md"
                        radius="md"
                        color="green"
                        leftSection={<IoAdd size={20} />}
                        onClick={() => handleOpenModal()}
                    >
                        Nuovo Tag
                    </Button>
                </Group>
            </Card>

            {/* Tags List */}
            {filteredTags.length > 0 ? (
                <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="lg">
                    {filteredTags.map((tag) => (
                        <Card
                            key={tag.tag_id}
                            padding="lg"
                            radius="md"
                            withBorder
                            shadow="sm"
                            className="hover:shadow-lg transition-all hover:-translate-y-1"
                            style={{ overflow: 'hidden' }}
                        >
                            {/* Header with tag icon and menu */}
                            <Group justify="space-between" mb="md" wrap="nowrap" align="flex-start">
                                <Group gap="xs">
                                    <div
                                        style={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: '8px',
                                            backgroundColor: 'var(--mantine-color-blue-light)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--mantine-color-blue-filled)',
                                        }}
                                    >
                                        <IoPricetag size={20} />
                                    </div>
                                    <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                                        <Text fw={700} size="md" truncate>
                                            {tag.tag_id}
                                        </Text>
                                        <Badge size="sm" color="blue" variant="light">
                                            {tag.points} punti
                                        </Badge>
                                    </Stack>
                                </Group>
                                <Menu shadow="md" width={140} position="bottom-end">
                                    <Menu.Target>
                                        <ActionIcon
                                            variant="subtle"
                                            color="gray"
                                            size="md"
                                            radius="md"
                                            aria-label="Altre azioni"
                                        >
                                            ⋮
                                        </ActionIcon>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Item
                                            onClick={() => handleOpenModal(tag)}
                                            leftSection={<IoPencil size={16} />}
                                        >
                                            Modifica
                                        </Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item
                                            color="red"
                                            onClick={() => {
                                                setTagToDelete(tag)
                                                setIsDeleteModalOpen(true)
                                            }}
                                            leftSection={<IoTrash size={16} />}
                                        >
                                            Elimina
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </Group>

                            {/* Stats */}
                            <Stack gap="xs">
                                <Group gap="xs">
                                    <Text size="xs" c="dimmed">
                                        ID univoco per assegnazione
                                    </Text>
                                </Group>
                            </Stack>
                        </Card>
                    ))}
                </SimpleGrid>
            ) : (
                <Card withBorder radius="md" padding="xl">
                    <Center>
                        <Stack align="center" gap="md">
                            <IoSearch size={48} style={{ opacity: 0.2 }} />
                            <Text c="dimmed" size="lg">Nessun tag trovato</Text>
                            <Text c="dimmed" size="sm">Crea un nuovo tag per iniziare</Text>
                        </Stack>
                    </Center>
                </Card>
            )}

            {/* Create/Edit Modal */}
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={<Text fw={700} size="lg">{editingTag ? "Modifica Tag" : "Nuovo Tag"}</Text>}
                centered
            >
                <Stack>
                    <TextInput
                        label="Tag ID"
                        description="Identificativo univoco del tag"
                        placeholder="es. check-in, workshop-1"
                        value={tagId}
                        onChange={(e) => setTagId(e.target.value)}
                        disabled={!!editingTag}
                        required
                    />
                    <NumberInput
                        label="Punti"
                        description="Punti assegnati con questo tag"
                        value={points}
                        onChange={setPoints}
                        min={0}
                        required
                    />
                    <Group justify="flex-end" gap="sm">
                        <Button variant="default" onClick={() => setOpened(false)}>
                            Annulla
                        </Button>
                        <Button onClick={handleSubmit} loading={submitting} color="green">
                            {editingTag ? "Aggiorna" : "Crea"}
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                opened={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false)
                    setTagToDelete(null)
                }}
                title="Conferma eliminazione"
                centered
            >
                <Stack gap="md">
                    <Group gap="xs">
                        <IoTrash size={24} color="red" />
                        <Text size="lg" fw={500}>
                            Sei sicuro di voler eliminare il tag "{tagToDelete?.tag_id}"?
                        </Text>
                    </Group>
                    <Text size="sm" c="dimmed">
                        Questa azione è irreversibile e il tag verrà rimosso permanentemente dal sistema.
                    </Text>
                    <Group justify="flex-end" gap="sm">
                        <Button
                            variant="default"
                            onClick={() => {
                                setIsDeleteModalOpen(false)
                                setTagToDelete(null)
                            }}
                        >
                            Annulla
                        </Button>
                        <Button
                            color="red"
                            onClick={handleDelete}
                        >
                            Elimina
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </Stack>
    )
}
