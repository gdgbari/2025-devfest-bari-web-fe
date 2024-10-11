import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { firebase, getQuizInfo, getQuizList, getUserProfileById } from "."
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


export const useQuizes = () => {
    return useQuery({
        queryKey: ["quizes"],
        queryFn: getQuizList
    })
}

export const useQuiz = ({ quizId: quizId }: { quizId: string }) => {
    return useQuery({
        queryKey: ["quiz"],
        queryFn: () => getQuizInfo(quizId)
    })
}

export const useUserProfile = (uid: string) => {
    return useQuery({
        queryKey: ["user-profile", uid],
        queryFn: () => getUserProfileById(uid)
    })
}