import { Button } from "react-daisyui"
import { AppMain } from "../AppMain"
import { firebase } from "../utils"
import { useEffect } from "react"
import { useFirebaseUserInfo } from "../utils/query";
import { sendEmailVerification } from "firebase/auth"
import { showNotification } from "@mantine/notifications"



export const AppPage = () => {

    const { user, hasLoaded } = useFirebaseUserInfo()
    useEffect(() => {
        if(user == null && hasLoaded) {
            location.href = "/login"
        }
    }, [user])

    const emailVerified = firebase.auth.currentUser?.emailVerified??false

    return <>
        {user?<AppMain>
            Welcome to your app menù!
            <b>You are {firebase.auth.currentUser?.displayName} with {firebase.auth.currentUser?.email}</b>
            <b>email verified: {emailVerified?"yes":"no"}</b>
            {!emailVerified && <Button onClick={() => {
                sendEmailVerification(user).then(() => {
                    showNotification({
                        title: "Verification email sent",
                        message: "Check your inbox",
                        color: "blue"
                    })
                }).catch((error) => {
                    showNotification({
                        title: `Error sending verification email [${error.code}]`,
                        message: error.message,
                        color: "red"
                    })
                })
            }}>
                Resend verification email
            </Button>}
            <b>UID: {firebase.auth.currentUser?.uid}</b>
            <Button onClick={() => {
                firebase.auth.signOut()
            }}>Logout</Button>
            
        </AppMain>:<AppMain>Loading...</AppMain>}
    </>
}