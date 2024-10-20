
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

export function shuffle(array: any[]) {
    let currentIndex = array.length;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
}

export const durationToString = (duration: Date): string => {
    let result = [] as string[]
    if (duration.getUTCHours() > 0) {
        result.push(`${duration.getUTCHours()} h`)
    }
    if (duration.getUTCMinutes() > 0) {
        result.push(`${duration.getUTCMinutes()} m`)
    }
    if (duration.getUTCSeconds() > 0) {
        result.push(`${duration.getUTCSeconds()} s`)
    }
    if (result.length === 0) result.push(`0 s`)
    return result.join(", ")
}

export const secondDurationToString = (duration: number): string => {
    let date = new Date(0)
    date.setSeconds(duration)
    return durationToString(date)
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

export const toggleQuiz = async (quizId: string) => {   
    const func = httpsCallable(firebase.functions, "toggleIsOpen")
    const gotData = await func({ quizId }).then((result) => {
        return result.data
    })
    const finalData = JSON.parse(gotData as string)
    if (finalData.error) {
        throw finalData.error
    }
    return finalData
}

export type LeaderBoardUser = {
    nickname: string,
    score: number,
    groupColor: string,
    timestamp: number,
}

export type LeaderBoardGroup = {
    name: string,
    score: number,
    timestamp: number,
    color: string
}

export type LeaderBoardData = {
    users: {
        [uid: string]: LeaderBoardUser
    },
    groups: {
        [gid: string]: LeaderBoardGroup
    }
}

export const QUIZ_TYPES = ["talk", "sponsor", "special", "hidden", "custom"] as const

export type QuizType = typeof QUIZ_TYPES[number]

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
    type: QuizType,
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

export const capitalizeString = (word: string) => {
    if (!word) return word;
    return word[0].toUpperCase() + word.slice(1).toLowerCase();
  }
