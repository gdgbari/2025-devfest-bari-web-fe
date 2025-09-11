import { AppMain } from "../AppMain"
import { firebase } from "../utils"
import { useEffect } from "react"
import { useFirebaseUserInfo, useUserProfile } from "../utils/query";
import { AppBar } from "../components/AppBar";
import { UserInfoPage } from "./app/UserInfoPage";
import { EmailVerificationPage } from "./app/EmailVerificationPage";
import { useAppRouter } from "../utils/store";
import { QuizList } from "./app/QuizList";
import { Container } from "@mantine/core";
import { QuizAdd } from "./app/QuizAdd";
import { LeaderBoard } from "./app/LeaderBoard";
import { QRScan } from "./app/QRScan";
import { QuizInfo } from "./app/QuizInfo";


export const AppPage = () => {

    const { user, hasLoaded } = useFirebaseUserInfo()
    const { currentPage, navigate } = useAppRouter()
    const emailVerified = firebase.auth.currentUser?.emailVerified ?? false
    const this_user = useUserProfile()


    useEffect(() => {
        if (hasLoaded){
            if (user == null) {
                location.href = "/login"
            }
            if (user && !emailVerified && currentPage !== "verify-email") {
                location.href = "/"
            }
        }
        if (this_user.isFetched && this_user.data?.role != "staff"){
            navigate("not-allowed")
        }
    }, [user, hasLoaded, this_user.isFetching])

    return <div className="flex flex-col h-full w-full justify-start" style={{minHeight: "100vh"}} >
        <AppBar></AppBar>
        <div className="text-center mx-5">
            <AppMain>
                <Container size="xl" mt="xl">
                    {
                        currentPage == "verify-email" ? <EmailVerificationPage user={user!} /> :
                        currentPage == "app" ? <QuizList /> :
                        currentPage == "add-quiz" ? <QuizAdd /> :
                        currentPage == "profile" ? <UserInfoPage user={user!} /> :
                        currentPage == "qrscan" ? <QRScan />:
                        currentPage == "leaderboard" ? <LeaderBoard /> :
                        currentPage == "quiz-info" ?  <QuizInfo /> : 
                        currentPage == "not-allowed"? <div className="text-2xl">You are not allowed to access this page</div> :
                        "Loading..."
                    }
                </Container>
            </AppMain>
        </div>
    </div>
}