import { sendEmailVerification, type User } from "firebase/auth"
import { Button } from "react-daisyui"
import { showNotification } from "@mantine/notifications"
import { AppMain } from "../../AppMain"

export const EmailVerificationPage = ({ user }:{ user: User }) => {
    return <AppMain>
        <div className="h-full flex flex-col justify-center items-center">
            <div className="max-w-[60vw]">
                <h1 className="text-2xl mb-10">
                    Your email has not been verified.
                    You must verify it before continue
                    with this application.
                </h1>

                <Button onClick={() => {
                    sendEmailVerification(user!).then(() => {
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
                </Button>
            </div>
        </div>
    </AppMain>
}