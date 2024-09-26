
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

//By https://emailregex.com/
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const isEmailValid = (email: string) => {
    return emailRegex.test(email)
}

export function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

