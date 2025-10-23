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
import { Role } from "../utils/types";
//import { QuizAdd } from "./app/QuizAdd";
//import { LeaderBoard } from "./app/LeaderBoard";
//import { QRScan } from "./app/QRScan";
//import { QuizInfo } from "./app/QuizInfo";


// Returns a list of users using the same wrapper format as `this_user`
export const getMockUsers = () => {
  return [
    {
      data: {
        uid: "Test",
        name: "Gabriele",
        surname: "Dellino",
        role: Role.STAFF,
        nickname: "gdellino",
        group: "group",
        email: "gdellino37@gmail.com",
      },
      isFetched: true,
      isFetching: false,
    },
    {
      data: {
        uid: "User2",
        name: "Mario",
        surname: "Rossi",
        role: Role.ATTENDEE,
        nickname: "mrossi",
        group: "group-a",
        email: "mario.rossi@example.com",
      },
      isFetched: true,
      isFetching: false,
    },
    {
      data: {
        uid: "User3",
        name: "Lucia",
        surname: "Bianchi",
        role: Role.STAFF,
        nickname: "lbianchi",
        group: "group-b",
        email: "lucia.bianchi@example.com",
      },
      isFetched: true,
      isFetching: false,
    },
  ]
}


export const AppPage = () => {

    const { user, hasLoaded } = useFirebaseUserInfo()
    const { currentPage, navigate } = useAppRouter()
    const emailVerified = true //firebase.auth.currentUser?.emailVerified ?? false
    const this_user = {
        data: {
            uid: "Test",
            name: "Gabriele",
            surname: "Dellino",
            role: Role.STAFF,
            nickname: "gdellino",
            group: "group",
            email: "gdellino37@gmail.com"
        },
        isFetched: true,
        isFetching: false
    }//useUserProfile()

    useEffect(() => {
        if (hasLoaded) {
            if (user == null) {
                location.href = "/login"
            }
            if (user && !emailVerified && currentPage !== "verify-email") {
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
