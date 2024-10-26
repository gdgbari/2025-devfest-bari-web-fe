import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { firebase, getQuizList, getUserProfile, getUserProfileById } from "."
import { useQuery } from "@tanstack/react-query"


export const useFirebaseUserInfo = () => {
    const [hasLoaded, setHasLoaded] = useState(false)
    useEffect(() => {
        onAuthStateChanged(firebase.auth, (user) => {
            setUser(user)
            setHasLoaded(true)
        })
    }, [])
    const [user, setUser] = useState(firebase.auth.currentUser)
    return { user, hasLoaded }
}


export const useQuizzes = () => {
    return useQuery({
        queryKey: ["quizzes"],
        queryFn: getQuizList,
        staleTime: 1000 * 60 * 5
    })
}

export const useUserProfile = () => {
    return useQuery({
        queryKey: ["user-profile"],
        queryFn: getUserProfile
    })
}

export const useUserProfileById = (uid: string) => {
    return useQuery({
        queryKey: ["user-profile", uid],
        queryFn: () => getUserProfileById(uid)
    })
}