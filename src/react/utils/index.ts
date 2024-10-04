
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { WebsiteConfig } from "../../config";
import {
    getFunctions,
    httpsCallable,
} from "firebase/functions";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";


export const firebaseApp = initializeApp(WebsiteConfig.FIREBASE_CONFIG);
export const firebase = {
    functions: getFunctions(firebaseApp),
    auth: getAuth(firebaseApp),
    database: getDatabase(firebaseApp)
}

export const createQuiz = async (data: any) => {
    const func = httpsCallable(firebase.functions, "createQuiz")
    const gotData = await func(data).then((result) => {
        return result.data
    })
    const finalData = JSON.parse(gotData as string)
    if (finalData.error){
        throw finalData.error
    }
    return finalData
}

type LeaderBoardData = {
    users: {
        [uid:string]: {
            nickname: string,
            score: number,
            groupColor: string,
            timestamp: number,
        }
    },
    groups: {
        [gid:string]: {
            name: string,
            score: number,
            timestamp: number,
            color: string
        }
    }
}


export const useLeaderboard = () => {

    const [leaderboardData, setLeaderboardData] = useState<LeaderBoardData | null>(null)
    useEffect(() => {
        onValue(ref(firebase.database, "leaderboard"), (data) => {
            setLeaderboardData(data.val())
        })
    }, [])
    
    return leaderboardData
}


export const colorConverter = (color: string) => {
    if (color === "green"){
        return "#34A853"
    }
    if (color === "blue"){
        return "#4285F4"
    }
    if (color === "red"){
        return "#EA4335"
    }
    if (color === "yellow"){
        return "#F9AB00"
    }
    return "#000000"
}

//By https://emailregex.com/
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const isEmailValid = (email: string) => {
    return emailRegex.test(email)
}

export function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

