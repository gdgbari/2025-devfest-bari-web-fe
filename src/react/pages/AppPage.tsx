import { AppMain } from "../AppMain"
import { firebase } from "../utils"
import { useEffect } from "react"
import { useFirebaseUserInfo } from "../utils/query";
import { AppBar } from "../components/AppBar";
import { UserInfoPage } from "./app/UserInfoPage";
import { EmailVerificationPage } from "./app/EmailVerificationPage";

export const AppPage = () => {

    const { user, hasLoaded } = useFirebaseUserInfo()
    useEffect(() => {
        if (user == null && hasLoaded) {
            location.href = "/login"
        }
    }, [user])

    const emailVerified = firebase.auth.currentUser?.emailVerified ?? false
    
    let subPage = <AppMain>Loading...</AppMain>;

    //TODO: Implement Sub Router for App Page
    if(user && emailVerified){
        subPage = UserInfoPage(user);
    }else if(user && !emailVerified){
        subPage = EmailVerificationPage(user);
    }

    return <div className="flex flex-col h-full w-full justify-start">
        <AppBar></AppBar>
        <div className="flex-1 text-center">

            {subPage}
        </div>
    </div>
}