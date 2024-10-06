
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { WebsiteConfig } from "../../config";
import {
    getFunctions,
    httpsCallable,
  } from "firebase/functions";

export const firebaseApp = initializeApp(WebsiteConfig.FIREBASE_CONFIG);
export const firebase = {
    functions: getFunctions(firebaseApp),
    auth: getAuth(firebaseApp),
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
    currentUser: {
        nickname: string,
        position: number,
        score: number,
        groupColor: string
    },
    users: {
        nickname: string,
        position: number,
        score: number,
        groupColor: string
    }[],
    groups: {
        groupId: string,
        name: string,
        score: number,
        position: number,
        imageUrl: string,
        color: string
    }[]
}


export const getLeaderboard = async () => {
    const func = httpsCallable(firebase.functions, "getLeaderboard")
    const gotData = await func().then((result) => {
        return result.data
    })
    const finalData = JSON.parse(gotData as string)
    if (finalData.error){
        throw finalData.error
    }
    if (finalData.data != null){
        return JSON.parse(finalData.data) as LeaderBoardData
    }
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

export const getQuizList = async () => {
    const func = httpsCallable(firebase.functions, "getQuizList");

    const response = await func();
    const rawData = response.data;
    const data = JSON.parse(rawData as string);

    if(data.error){
        throw data.error;
    }

    return data;
}

//By https://emailregex.com/
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const isEmailValid = (email: string) => {
    return emailRegex.test(email)
}

export function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

