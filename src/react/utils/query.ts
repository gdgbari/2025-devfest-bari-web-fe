import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { firebase } from "."
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getCurrentUserRequest,
    getAllUsersRequest,
    getUserRequest,
    createUserRequest,
    updateUserRequest,
    deleteUserRequest,
    checkInRequest,
    getUserQuizResultsRequest,
    getAllGroupsRequest,
    getGroupRequest,
    createGroupRequest,
    updateGroupRequest,
    deleteGroupRequest,
    deleteAllGroupsRequest,
    getAllQuizzesRequest,
    getQuizRequest,
    createQuizRequest,
    updateQuizRequest,
    deleteQuizRequest,
    submitQuizRequest,
    getAllTagsRequest,
    getSessionizeSessionsRequest,
    getSessionizeAllRequest,
    getRemoteConfigRequest,
    updateRemoteConfigRequest,
} from "./requests"
import type {
    CreateUserRequest,
    UpdateUserRequest,
    CreateGroupRequest,
    UpdateGroupRequest,
    CreateQuizRequest,
    UpdateQuizRequest,
    SubmitQuizRequest,
    SessionizeSession,
    RemoteConfig,
} from "./types"

// ========================
// Firebase Auth Hook
// ========================

export const useFirebaseUserInfo = () => {
    const [hasLoaded, setHasLoaded] = useState(false)
    const [user, setUser] = useState(firebase.auth.currentUser)

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(firebase.auth, (user) => {
            setUser(user)
            setHasLoaded(true)
        })
        return () => unsubscribe()
    }, [])

    return { user, hasLoaded }
}

// ========================
// User Queries
// ========================

export const useUserProfile = () => {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: getCurrentUserRequest,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export const useAllUsers = () => {
    return useQuery({
        queryKey: ["users"],
        queryFn: getAllUsersRequest,
        staleTime: 1000 * 60 * 2, // 2 minutes
    })
}

export const useUser = (uid: string) => {
    return useQuery({
        queryKey: ["user", uid],
        queryFn: () => getUserRequest(uid),
        enabled: !!uid,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export const useUserQuizResults = (uid: string) => {
    return useQuery({
        queryKey: ["user-quiz-results", uid],
        queryFn: () => getUserQuizResultsRequest(uid),
        enabled: !!uid,
        staleTime: 1000 * 60 * 2, // 2 minutes
    })
}

// ========================
// User Mutations
// ========================

export const useCreateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateUserRequest) => createUserRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        },
    })
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ uid, data }: { uid: string; data: UpdateUserRequest }) =>
            updateUserRequest(uid, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            queryClient.invalidateQueries({ queryKey: ["user", variables.uid] })
            queryClient.invalidateQueries({ queryKey: ["user-profile"] })
        },
    })
}

export const useDeleteUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (uid: string) => deleteUserRequest(uid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        },
    })
}

export const useCheckIn = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => checkInRequest(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["user-profile"] })
        },
    })
}

// ========================
// Group Queries
// ========================

export const useAllGroups = () => {
    return useQuery({
        queryKey: ["groups"],
        queryFn: getAllGroupsRequest,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

export const useGroup = (gid: string) => {
    return useQuery({
        queryKey: ["group", gid],
        queryFn: () => getGroupRequest(gid),
        enabled: !!gid,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

// ========================
// Group Mutations
// ========================

export const useCreateGroup = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateGroupRequest) => createGroupRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] })
        },
    })
}

export const useUpdateGroup = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ gid, data }: { gid: string; data: UpdateGroupRequest }) =>
            updateGroupRequest(gid, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["groups"] })
            queryClient.invalidateQueries({ queryKey: ["group", variables.gid] })
        },
    })
}

export const useDeleteGroup = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (gid: string) => deleteGroupRequest(gid),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] })
        },
    })
}

export const useDeleteAllGroups = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => deleteAllGroupsRequest(),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] })
        },
    })
}

// ========================
// Quiz Queries
// ========================

export const useQuizzes = () => {
    return useQuery({
        queryKey: ["quizzes"],
        queryFn: getAllQuizzesRequest,
        staleTime: 1000 * 60 * 2, // 2 minutes
    })
}

export const useQuiz = (quiz_id: string) => {
    return useQuery({
        queryKey: ["quiz", quiz_id],
        queryFn: () => getQuizRequest(quiz_id),
        enabled: !!quiz_id,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

// ========================
// Quiz Mutations
// ========================

export const useCreateQuiz = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateQuizRequest) => createQuizRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quizzes"] })
        },
    })
}

export const useUpdateQuiz = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ quiz_id, data }: { quiz_id: string; data: UpdateQuizRequest }) =>
            updateQuizRequest(quiz_id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["quizzes"] })
            queryClient.invalidateQueries({ queryKey: ["quiz", variables.quiz_id] })
        },
    })
}

export const useDeleteQuiz = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (quiz_id: string) => deleteQuizRequest(quiz_id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["quizzes"] })
        },
    })
}

export const useSubmitQuiz = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ quiz_id, data }: { quiz_id: string; data: SubmitQuizRequest }) =>
            submitQuizRequest(quiz_id, data),
        onSuccess: () => {
            // Invalidate user profile to update score
            queryClient.invalidateQueries({ queryKey: ["user-profile"] })
        },
    })
}


// ========================
// Tag Queries
// ========================

export const useAllTags = () => {
    return useQuery({
        queryKey: ["tags"],
        queryFn: getAllTagsRequest,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

// ========================
// Sessionize Queries
// ========================

export const useSessionizeSessions = () => {
    return useQuery({
        queryKey: ["sessionize-sessions"],
        queryFn: async () => {
            const data = await getSessionizeAllRequest()
            return (data?.sessions || []) as SessionizeSession[]
        },
        staleTime: 1000 * 60 * 10, // 10 minutes
    })
}

// ========================
// Remote Config Queries
// ========================

export const useRemoteConfig = () => {
    return useQuery({
        queryKey: ["remote-config"],
        queryFn: getRemoteConfigRequest,
        staleTime: 1000 * 60 * 5, // 5 minutes
    })
}

// ========================
// Remote Config Mutations
// ========================

export const useUpdateRemoteConfig = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Partial<RemoteConfig>) => updateRemoteConfigRequest(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["remote-config"] })
        },
    })
}

// ========================
// Admin Mutations
// ========================

export const useResetData = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: () => import("./requests").then(r => r.resetDataRequest()),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
            queryClient.invalidateQueries({ queryKey: ["groups"] })
            queryClient.invalidateQueries({ queryKey: ["leaderboard"] })
            queryClient.invalidateQueries({ queryKey: ["tags"] })
        },
    })
}
