import { onSnapshot, collection, doc } from "firebase/firestore"
import { useEffect, useState } from "react"
import type {
    LeaderBoardData,
    AnswerSchema,
    QuestionSchema,
    ReadAnswerSchema,
    ReadQuestionSchema,
    ReadQuestionWithCorrectSchema,
    GetUserResponse,
    GetUserListResponse,
    CreateUserRequest,
    CreateUserResponse,
    UpdateUserRequest,
    UpdateUserResponse,
    CheckInResponse,
    GetGroupResponse,
    GetGroupListResponse,
    CreateGroupRequest,
    CreateGroupResponse,
    UpdateGroupRequest,
    UpdateGroupResponse,
    GetQuizResponse,
    GetQuizWithCorrectResponse,
    GetQuizListWithCorrectResponse,
    CreateQuizRequest,
    CreateQuizResponse,
    UpdateQuizRequest,
    UpdateQuizResponse,
    SubmitQuizRequest,
    SubmitQuizResponse,
    GetTagListResponse,
    GetTagResponse,
    CreateTagRequest,
    CreateTagResponse,
    UpdateTagRequest,
    UpdateTagResponse,
    SessionizeGridSmart,
    SessionizeSession,
    SessionizeSpeaker,
    SessionizeSpeakerWall,
} from "./types"
import { Role } from "./types"
import { firebase } from "."

const BACKEND_URL = import.meta.env.DEV
    ? "http://127.0.0.1:8080"
    : "https://devfest-bari-2025-be-service-1025838144406.europe-west1.run.app"

// ========================
// Leaderboard (from Firestore)
// ========================

export const useLeaderboard = () => {
    const [leaderboardData, setLeaderboardData] = useState<LeaderBoardData | null>(null)

    useEffect(() => {
        // Listen to leaderboard_users collection
        const usersUnsubscribe = onSnapshot(
            collection(firebase.firestore, "leaderboard_users"),
            (usersSnapshot) => {
                const users: { [uid: string]: any } = {}
                usersSnapshot.forEach((doc) => {
                    users[doc.id] = doc.data()
                })

                // Listen to leaderboard_groups collection
                const groupsUnsubscribe = onSnapshot(
                    collection(firebase.firestore, "leaderboard_groups"),
                    (groupsSnapshot) => {
                        const groups: { [gid: string]: any } = {}
                        groupsSnapshot.forEach((doc) => {
                            groups[doc.id] = doc.data()
                        })

                        setLeaderboardData({
                            leaderboard_users: users,
                            leaderboard_groups: groups
                        })
                    }
                )

                return () => groupsUnsubscribe()
            }
        )

        return () => usersUnsubscribe()
    }, [])

    return leaderboardData
}

// ========================
// Backend Request Helper
// ========================

export const backendRequest = async (method: string, path: string, body?: any) => {
    const tokenId = await firebase.auth.currentUser?.getIdToken()
    const response = await fetch(BACKEND_URL + "/api/" + path, {
        method,
        headers: {
            "Authorization": `Bearer ${tokenId}`,
            ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {})
    })
    if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Request failed [${response.status}]: ${errorText}`)
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return null
    }

    return await response.json()
}

// ========================
// User Endpoints
// ========================

export const getCurrentUserRequest = async (): Promise<GetUserResponse & { role: Role }> => {
    const userData = await backendRequest("GET", "users/me") as GetUserResponse

    // Estrai il ruolo dal token Firebase Auth
    const idTokenResult = await firebase.auth.currentUser?.getIdTokenResult()
    const role = (idTokenResult?.claims?.user_role as Role) ?? Role.ATTENDEE

    return {
        ...userData,
        role
    }
}

export const getAllUsersRequest = async (): Promise<GetUserListResponse> => {
    return await backendRequest("GET", "users")
}

export const getUserRequest = async (uid: string): Promise<GetUserResponse> => {
    return await backendRequest("GET", `users/${uid}`)
}

export const createUserRequest = async (data: CreateUserRequest): Promise<CreateUserResponse> => {
    return await backendRequest("POST", "users", data)
}

export const updateUserRequest = async (uid: string, data: UpdateUserRequest): Promise<UpdateUserResponse> => {
    return await backendRequest("PUT", `users/${uid}`, data)
}

export const deleteUserRequest = async (uid: string): Promise<null> => {
    return await backendRequest("DELETE", `users/${uid}`)
}

export const checkInRequest = async (): Promise<CheckInResponse> => {
    return await backendRequest("POST", "users/check-in")
}

// ========================
// Group Endpoints
// ========================

export const getAllGroupsRequest = async (): Promise<GetGroupListResponse> => {
    return await backendRequest("GET", "groups")
}

export const getGroupRequest = async (gid: string): Promise<GetGroupResponse> => {
    return await backendRequest("GET", `groups/${gid}`)
}

export const createGroupRequest = async (data: CreateGroupRequest): Promise<CreateGroupResponse> => {
    return await backendRequest("POST", "groups", data)
}

export const updateGroupRequest = async (gid: string, data: UpdateGroupRequest): Promise<UpdateGroupResponse> => {
    return await backendRequest("PUT", `groups/${gid}`, data)
}

export const deleteGroupRequest = async (gid: string): Promise<null> => {
    return await backendRequest("DELETE", `groups/${gid}`)
}

export const deleteAllGroupsRequest = async (): Promise<null> => {
    return await backendRequest("DELETE", "groups")
}

// ========================
// Quiz Endpoints
// ========================

export const getAllQuizzesRequest = async (): Promise<GetQuizListWithCorrectResponse> => {
    return await backendRequest("GET", "quizzes")
}

export const getQuizRequest = async (quiz_id: string): Promise<GetQuizResponse> => {
    return await backendRequest("GET", `quizzes/${quiz_id}`)
}

export const createQuizRequest = async (data: CreateQuizRequest): Promise<CreateQuizResponse> => {
    return await backendRequest("POST", "quizzes", data)
}

export const updateQuizRequest = async (quiz_id: string, data: UpdateQuizRequest): Promise<UpdateQuizResponse> => {
    return await backendRequest("PUT", `quizzes/${quiz_id}`, data)
}

export const deleteQuizRequest = async (quiz_id: string): Promise<null> => {
    return await backendRequest("DELETE", `quizzes/${quiz_id}`)
}

export const submitQuizRequest = async (quiz_id: string, data: SubmitQuizRequest): Promise<SubmitQuizResponse> => {
    return await backendRequest("POST", `quizzes/${quiz_id}/submit`, data)
}

// ========================
// Tag Endpoints
// ========================

export const getAllTagsRequest = async (): Promise<GetTagListResponse> => {
    return await backendRequest("GET", "tags")
}

export const getTagRequest = async (tag_id: string): Promise<GetTagResponse> => {
    return await backendRequest("GET", `tags/${tag_id}`)
}

export const createTagRequest = async (data: CreateTagRequest): Promise<CreateTagResponse> => {
    return await backendRequest("POST", "tags", data)
}

export const updateTagRequest = async (tag_id: string, data: UpdateTagRequest): Promise<UpdateTagResponse> => {
    return await backendRequest("PUT", `tags/${tag_id}`, data)
}

export const deleteTagRequest = async (tag_id: string): Promise<null> => {
    return await backendRequest("DELETE", `tags/${tag_id}`)
}

// ========================
// Sessionize Endpoints
// ========================

export const getSessionizeAllRequest = async (): Promise<any> => {
    return await backendRequest("GET", "sessionize/all")
}

export const getSessionizeGridSmartRequest = async (): Promise<SessionizeGridSmart> => {
    return await backendRequest("GET", "sessionize/grid-smart")
}

export const getSessionizeSessionsRequest = async (): Promise<SessionizeSession[]> => {
    return await backendRequest("GET", "sessionize/sessions")
}

export const getSessionizeSpeakersRequest = async (): Promise<SessionizeSpeaker[]> => {
    return await backendRequest("GET", "sessionize/speakers")
}

export const getSessionizeSpeakerWallRequest = async (): Promise<SessionizeSpeakerWall> => {
    return await backendRequest("GET", "sessionize/speaker-wall")
}
