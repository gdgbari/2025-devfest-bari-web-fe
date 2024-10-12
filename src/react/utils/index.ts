
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
    if (finalData.error) {
        throw finalData.error
    }
    return finalData
}

type LeaderBoardData = {
    users: {
        [uid: string]: {
            nickname: string,
            score: number,
            groupColor: string,
            timestamp: number,
        }
    },
    groups: {
        [gid: string]: {
            name: string,
            score: number,
            timestamp: number,
            color: string
        }
    }
}

export type Quiz = {
    quizId: string,
    creatorUid: string,
    isOpen: boolean,
    maxScore: string,
    questionList: Question[],
    title: string,
    timerDuration: number,
    talkId: string,
    sponsorId: string,
    type: "talk" | "sponsor" | "special" | "hidden",
}

export type Question = {
    questionId: string,
    text: string,
    correctAnswer: string|null,
    value: number|null,
    answerList: Answer[],
}

export type Answer = {
    id: string,
    text: string,
}
export type UserProfile = {
    userId: string,
    nickname: string,
    email: string,
    name: string,
    surname: string,
    group: {
        groupId: string,
        name: string,
        imageUrl: string,
        color: string,
    },
    groupId: string,
    position: string,
    role: string
}

export type AddPointRequest = {
    title: string,
    value: number,
    userIdList: string[]
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
    if (color === "green") {
        return "#34A853"
    }
    if (color === "blue") {
        return "#4285F4"
    }
    if (color === "red") {
        return "#EA4335"
    }
    if (color === "yellow") {
        return "#F9AB00"
    }
    return "#000000"
}

export const getQuizList = async () => {
    const func = httpsCallable(firebase.functions, "getQuizList");

    const response = await func();
    const rawData = response.data;
    const { error, data } = JSON.parse(rawData as string);

    if (error) {
        throw {
            name: error['errorCode'],
            message: error['details'],
            stack : '/getQuizList'
        } as Error;
    }

    return JSON.parse(data) as Quiz[];
}

export const getUserProfileById = async (uid: string) => {
    const func = httpsCallable(firebase.functions, "getUserProfileById");

    const response = await func({ userId: uid });
    const rawData = response.data;
    const { error, data } = JSON.parse(rawData as string);

    if (error) {
        throw data.error;
    }

    return JSON.parse(data) as UserProfile;
}

export const addPointsToUsers = async (info: AddPointRequest) => {
    const func = httpsCallable(firebase.functions, "addPointsToUsers");

    info.value = parseFloat(info.value.toString())

    const response = await func(info);
    const rawData = response.data;
    const { error, data } = JSON.parse(rawData as string);

    if (error) {
        throw data.error;
    }

    return JSON.parse(data) as UserProfile;
}

//By https://emailregex.com/
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const isEmailValid = (email: string) => {
    return emailRegex.test(email)
}

export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

