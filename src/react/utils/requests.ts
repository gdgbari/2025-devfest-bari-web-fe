import { onValue, ref } from "firebase/database"
import { useEffect, useState } from "react"
import type { LeaderBoardData, Quiz, UserProfile } from "./types"
import { firebase } from "."


const BACKEND_URL = import.meta.env.DEV ? "http://127.0.0.1:8888" : ""


//TODO in the future
export const useLeaderboard = () => {

    const [leaderboardData, setLeaderboardData] = useState<LeaderBoardData | null>(null)
    useEffect(() => {
        onValue(ref(firebase.database, "leaderboard"), (data) => {
            setLeaderboardData(data.val())
        })
    }, [])

    return leaderboardData
}


export const backendRequest = async (method: string, path: string, body?: any) => {
    const tokenId = await firebase.auth.currentUser?.getIdToken()
    if (import.meta.env.DEV) {
        console.log("Token ID:", tokenId)
    }
    const respose = await fetch(BACKEND_URL + "/api/" + path, {
        method,
        headers: {
            "Authorization": `Bearer ${tokenId}`,
            ...(body ? { "Content-Type": "application/json" } : {}),
        },
        ...(body ? { body: JSON.stringify(body) } : {})
    })
    if (!respose.ok) {
        // TODO better error handling
        throw new Error(`Request failed [${respose.status}]`)
    }
    return await respose.json()
}


export const getCurrentUserRequest = async () => {
    return await backendRequest("GET", "users/me") as UserProfile
}

/*

export const setQuiz = async (quizData: Quiz) => {
    return await backendRequest("POST", "quiz", quizData) as Quiz
}

*/