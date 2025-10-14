import { sendEmailVerification, type User } from "firebase/auth"
import { Button } from "react-daisyui"
import { notifications } from "@mantine/notifications"
import { AppMain } from "../../AppMain"

export const EmailVerificationPage = ({ user }: { user: User }) => {
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
                        notifications.show({
                            title: "Verification email sent",
                            message: "Check your inbox",
                            color: "yellow"
                        })
                    }).catch((error) => {
                        notifications.show({
                            title: `Error sending verification email [${error.code}]`,
                            message: error.message,
                            color: "yellow"
                        })
                    }).finally(() => {

                    })
                }}>
                    Resend verification email
                </Button>
            </div>
        </div>
    </AppMain>
}