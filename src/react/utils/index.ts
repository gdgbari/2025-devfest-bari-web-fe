
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { WebsiteConfig } from "../../config";
import { useEffect, useState } from "react";


export const firebaseApp = initializeApp(WebsiteConfig.FIREBASE_CONFIG);
export const firebase = {
    auth: getAuth(firebaseApp),
}

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

//By https://emailregex.com/
const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const isEmailValid = (email: string) => {
    return emailRegex.test(email)
}

export function capitalizeFirstLetter(string:string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

