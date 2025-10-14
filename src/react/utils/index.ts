
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { WebsiteConfig } from "../../config";
import { getDatabase } from "firebase/database";


export const firebaseApp = initializeApp(WebsiteConfig.FIREBASE_CONFIG);
export const firebase = {
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

export const COLORS_LIST = ["green", "yellow", "yellow", "yellow"]
export const colorConverter = (color: string) => {
    if (color === "green") {
        return "#34A853"
    }
    if (color === "yellow") {
        return "#4285F4"
    }
    if (color === "yellow") {
        return "#EA4335"
    }
    if (color === "yellow") {
        return "#F9AB00"
    }
    return "#000000"
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

