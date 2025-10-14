import { AppMain } from "../AppMain"
import { firebase } from "../utils"
import { useEffect } from "react"
import { useFirebaseUserInfo, useUserProfile } from "../utils/query";
import { AppBar } from "../components/AppBar";
//import { UserInfoPage } from "./app/UserInfoPage";
import { EmailVerificationPage } from "./app/EmailVerificationPage";
import { useAppRouter } from "../utils/store";
//import { QuizList } from "./app/QuizList";
import { Container } from "@mantine/core";
import { Dashboard } from "./Dashboard";
//import { QuizAdd } from "./app/QuizAdd";
//import { LeaderBoard } from "./app/LeaderBoard";
//import { QRScan } from "./app/QRScan";
//import { QuizInfo } from "./app/QuizInfo";


export const AppPage = () => {

    const { user, hasLoaded } = useFirebaseUserInfo()
    const { currentPage, navigate } = useAppRouter()
    const emailVerified = firebase.auth.currentUser?.emailVerified ?? false
    const this_user = useUserProfile()

    useEffect(() => {
        if (hasLoaded) {
            if (user == null) {
                location.href = "/login"
            }
            if (user && false && currentPage !== "verify-email") { //!emailVerified TODO
                navigate("verify-email")
            }
        }
        if (this_user.isFetched) {
            const role = this_user.data?.role ?? "attendee"
            if (!pagePermissions[role].includes(currentPage)) {
                navigate("not-allowed")
            }
        }
    }, [user, hasLoaded, this_user.isFetching])

    const pagePermissions = {
        "admin": ["app", "add-quiz", "leaderboard", "qrscan", "quiz-info", "profile", "verify-email"],
        "staff": ["app", "add-quiz", "leaderboard", "qrscan", "quiz-info", "profile", "verify-email"],
        "speaker": ["verify-email"],
        "attendee": ["verify-email"],
    }

    const pagesRouting = {
        "verify-email": <EmailVerificationPage user={user!} />,
        "app": <Dashboard user={this_user.data!} />, /* <QuizList /> */
        "add-quiz": <div />, /*<QuizAdd /> */
        "profile": <div />, /* <UserInfoPage user={user!} /> */
        "qrscan": <div />, /* <QRScan /> */
        "leaderboard": <div />, /* <LeaderBoard /> */
        "quiz-info": <div />, /*<QuizInfo />*/
        "not-allowed": <div className="text-2xl">You are not allowed to access this page</div>,
    }

    return <div className="flex flex-col h-full w-full justify-start" style={{ minHeight: "100vh" }
    } >
        <AppBar />
        <div className="text-center mx-5">
            <AppMain>
                <Container size="xl" mt="xl">
                    {this_user.isFetched && pagesRouting[currentPage] || "Loading..."}
                </Container>
            </AppMain>
        </div>
    </div >
}