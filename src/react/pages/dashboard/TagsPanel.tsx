import { useEffect, useState } from "react"
import {
    Table,
    Button,
    Modal,
    TextInput,
    NumberInput,
    Group,
    Stack,
    Title,
    ActionIcon,
    LoadingOverlay,
    Text
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { IoAdd, IoPencil, IoTrash } from "react-icons/io5"
import { notifications } from "@mantine/notifications"
import {
    getAllTagsRequest,
    createTagRequest,
    updateTagRequest,
    deleteTagRequest
} from "../../utils/requests"
import type { GetTagResponse } from "../../utils/types"

export const TagsPanel = () => {
    const [tags, setTags] = useState<GetTagResponse[]>([])
    const [loading, setLoading] = useState(false)
    const [opened, { open, close }] = useDisclosure(false)
    const [editingTag, setEditingTag] = useState<GetTagResponse | null>(null)

    // Form state
    const [tagId, setTagId] = useState("")
    const [points, setPoints] = useState<number | string>(10)

    const fetchTags = async () => {
        setLoading(true)
        try {
            const response = await getAllTagsRequest()
            setTags(response.tags)
        } catch (error) {
            console.error(error)
            notifications.show({
                title: "Errore",
                message: "Impossibile caricare i tag",
                color: "red"
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTags()
    }, [])

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
        open()
    }

    const handleSubmit = async () => {
        if (!tagId) return

        setLoading(true)
        try {
            if (editingTag) {
                await updateTagRequest(editingTag.tag_id, { points: Number(points) })
                notifications.show({
                    title: "Successo",
                    message: "Tag aggiornato correttamente",
                    color: "green"
                })
            } else {
                await createTagRequest({ tag_id: tagId, points: Number(points) })
                notifications.show({
                    title: "Successo",
                    message: "Tag creato correttamente",
                    color: "green"
                })
            }
            close()
            fetchTags()
        } catch (error) {
            console.error(error)
            notifications.show({
                title: "Errore",
                message: "Operazione fallita",
                color: "red"
            })
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (tagId: string) => {
        if (!window.confirm("Sei sicuro di voler eliminare questo tag?")) return

        setLoading(true)
        try {
            await deleteTagRequest(tagId)
            notifications.show({
                title: "Successo",
                message: "Tag eliminato correttamente",
                color: "green"
            })
            fetchTags()
        } catch (error) {
            console.error(error)
            notifications.show({
                title: "Errore",
                message: "Impossibile eliminare il tag",
                color: "red"
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Stack>
            <Group justify="space-between">
                <Title order={2}>Gestione Tag</Title>
                <Button leftSection={<IoAdd />} onClick={() => handleOpenModal()}>
                    Nuovo Tag
                </Button>
            </Group>

            <div style={{ position: "relative", minHeight: 200 }}>
                <LoadingOverlay visible={loading} />
                <Table striped highlightOnHover>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Tag ID</Table.Th>
                            <Table.Th>Punti</Table.Th>
                            <Table.Th>Azioni</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {tags.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={3}>
                                    <Text ta="center" c="dimmed">Nessun tag presente</Text>
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            tags.map((tag) => (
                                <Table.Tr key={tag.tag_id}>
                                    <Table.Td>{tag.tag_id}</Table.Td>
                                    <Table.Td>{tag.points}</Table.Td>
                                    <Table.Td>
                                        <Group gap="xs">
                                            <ActionIcon variant="subtle" color="blue" onClick={() => handleOpenModal(tag)}>
                                                <IoPencil />
                                            </ActionIcon>
                                            <ActionIcon variant="subtle" color="red" onClick={() => handleDelete(tag.tag_id)}>
                                                <IoTrash />
                                            </ActionIcon>
                                        </Group>
                                    </Table.Td>
                                </Table.Tr>
                            ))
                        )}
                    </Table.Tbody>
                </Table>
            </div>

            <Modal opened={opened} onClose={close} title={editingTag ? "Modifica Tag" : "Nuovo Tag"}>
                <Stack>
                    <TextInput
                        label="Tag ID"
                        placeholder="Inserisci ID univoco"
                        value={tagId}
                        onChange={(e) => setTagId(e.target.value)}
                        disabled={!!editingTag}
                        required
                    />
                    <NumberInput
                        label="Punti"
                        value={points}
                        onChange={setPoints}
                        min={0}
                        required
                    />
                    <Button onClick={handleSubmit} loading={loading}>
                        {editingTag ? "Aggiorna" : "Crea"}
                    </Button>
                </Stack>
            </Modal>
        </Stack>
    )
}
