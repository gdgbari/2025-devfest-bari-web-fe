import { AppMain } from "../AppMain"
import { firebase } from "../utils"
import { useEffect } from "react"
import { useFirebaseUserInfo } from "../utils/query";
import { AppBar } from "../components/AppBar";
import { UserInfoPage } from "./app/UserInfoPage";
import { EmailVerificationPage } from "./app/EmailVerificationPage";
import { useAppRouter } from "../utils/store";
import { QuizList } from "./app/QuizList";
import { Container } from "@mantine/core";
import { QuizAdd } from "./app/QuizAdd";
import { LeaderBoard } from "./app/LeaderBoard";


export const AppPage = () => {

    const { user, hasLoaded } = useFirebaseUserInfo()
    const { currentPage, navigate } = useAppRouter()
    const emailVerified = firebase.auth.currentUser?.emailVerified ?? false

    useEffect(() => {
        if (hasLoaded){
            if (user == null) {
                location.href = "/login"
            }
            if (user && !emailVerified && currentPage !== "verify-email") {
                navigate("verify-email")
            }
        }
    }, [user, hasLoaded])

    return <div className="flex flex-col h-full w-full justify-start" style={{minHeight: "100vh"}} >
        <AppBar></AppBar>
        <div className="text-center mx-5">
            <AppMain>
                <Container size="xl" mt="xl">
                    {
                        currentPage == "verify-email" ? <EmailVerificationPage user={user!}></EmailVerificationPage> :
                        currentPage == "app" ? <QuizList /> :
                        currentPage == "add-quiz" ? <QuizAdd /> :
                        currentPage == "profile" ? <UserInfoPage user={user!}></UserInfoPage> :
                        currentPage == "leaderboard" ? <LeaderBoard /> : "Loading..."
                    }
                </Container>
            </AppMain>
        </div>
    </div>
}