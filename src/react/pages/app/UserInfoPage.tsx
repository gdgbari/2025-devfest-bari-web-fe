import type { User } from "firebase/auth"
import { AppMain } from "../../AppMain"
import { firebase } from "../../utils"

export const UserInfoPage = (user: User) => {
    return <AppMain>
        <p>Welcome to your app menù!</p>
        <p><b>You are {firebase.auth.currentUser?.displayName} with {firebase.auth.currentUser?.email}</b></p>
        <p><b>email verified: {user.emailVerified ? "yes" : "no"}</b></p>
        <p><b>UID: {firebase.auth.currentUser?.uid}</b></p>
    </AppMain>
}