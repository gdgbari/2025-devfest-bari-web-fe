import { onAuthStateChanged } from "firebase/auth"
import { useEffect, useState } from "react"
import { firebase, useLeaderboard } from "."
//import { useQuery } from "@tanstack/react-query"


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
