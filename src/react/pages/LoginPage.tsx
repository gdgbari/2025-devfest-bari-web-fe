import { AppMain } from "../AppMain";
import { Card, Checkbox, Form, Input } from "react-daisyui"
import { useForm } from "@mantine/form"
import { WebsiteConfig } from "../../config";
import { useTranslations } from "../../i18n/utils";
import { notifications, showNotification } from "@mantine/notifications";
import { firebase, isEmailValid } from "../utils";
import { useFirebaseUserInfo } from "../utils/query";
import { useEffect, useState } from "react";
import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { set } from "firebase/database";

export const LoginPage = () => {
    const form = useForm({
        initialValues: {
            email: "",
            password: ""
        },
        validate: {
            email: (value) => value.length > 0? isEmailValid(value)? undefined: "The email given is invalid": "Email is required",
            password: (value) => value.length > 0 || recoverPassword? undefined: "Password is required"
        },
        validateInputOnChange: true,
        initialErrors: {
            email: "Email is required",
            password: "Password is required"
        }
    })

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [recoverPassword, setRecoveryPassword] = useState(false)

    useEffect(() => {
        form.isValid() //Trigger validation
    }, [recoverPassword])

    const t = useTranslations("en")

    const checkErrors = () => {
        if (!form.isValid()) {
            showNotification({
                title: "Form error",
                message: Object.values(form.errors).join(", "),
                color: "red"
            })
        }
    }

    const { user, hasLoaded } = useFirebaseUserInfo()
    useEffect(() => {
        if(user != null && hasLoaded) {
            location.href = "/app"
        }
    }, [user])

    return (
        <AppMain>
            <Form onSubmit={form.onSubmit((data)=>{

                    setLoading(true)
                    if (recoverPassword){
                        const requestId = notifications.show({
                            loading: true,
                            title: "Requiring the password reset...",
                            message: "Please wait untils the request is complete",
                            autoClose: false
                        })
                        sendPasswordResetEmail(firebase.auth, data.email)
                            .then(() => {
                                notifications.update({
                                    id: requestId,
                                    loading: false,
                                    title: "Email sent",
                                    message: `An email was sent to ${data.email} with instructions to reset your password if the email exists`,
                                    color: "green",
                                    autoClose: true
                                })
                                setRecoveryPassword(false)
                            }).catch((error) => {
                                notifications.update({
                                    id: requestId,
                                    loading: false,
                                    title: `Error [${error.code}]`,
                                    message: error.message,
                                    color: "red",
                                    autoClose: true
                                })
                            }).finally(() => {
                                setLoading(false)
                            })
                    }else{
                        const requestId = notifications.show({
                            loading: true,
                            title: "Logging in...",
                            message: "Please wait untils the login is complete",
                            autoClose: false
                        })
                        signInWithEmailAndPassword(firebase.auth, data.email, data.password)
                            .then((userCredential) => {
                                const user = userCredential.user;
                                notifications.update({
                                    id: requestId,
                                    loading: false,
                                    title: "Login success",
                                    message: `Welcome ${user.displayName}`,
                                    color: "green",
                                    autoClose: true
                                })
                            }).catch((error) => {
                                notifications.update({
                                    id: requestId,
                                    loading: false,
                                    title: `Login error [${error.code}]`,
                                    message: error.message,
                                    color: "red",
                                    autoClose: true
                                })
                            }).finally(() => {
                                setLoading(false)
                            })
                    }
                })
            }>
                <Card className="md:px-20 md:py-16 bg-black md:bg-opacity-60 bg-opacity-25 z-10 md:h-fit md:w-fit h-screen w-screen justify-center rounded-none px-5 md:rounded-xl">
                    <div className="flex flex-col opacity-100 justify-center items-center">
                        <img src="/assets/vectors/logo_big.svg" className="h-36 m-2 px-8 md:p-0 md:m-6" />
                        <p className="text-2xl md:text-3xl font-semibold mt-5">
                            {
                            WebsiteConfig.EVENT_START.toLocaleDateString("en", {
                                timeZone: WebsiteConfig.EVENT_TIMEZONE,
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })
                            }
                        </p>
                        <p className="text-2xl md:text-3xl font-semibold">{t("info.locationName")}</p>
                        <div className="flex flex-col mt-10 w-full">
                            <Input placeholder="Email" type="text" {...form.getInputProps("email")} />
                            
                            { !recoverPassword && <Input placeholder="Password" type={showPassword?"text":"password"} className="mt-3" {...form.getInputProps("password")} />}
                            <div className="flex w-full text-white justify-between mt-2">
                                <div
                                    className="text-sm cursor-pointer flex items-center justify-center"
                                    onClick={()=>setRecoveryPassword(!recoverPassword)}
                                >
                                    <b><u>{recoverPassword?"Back to login":"Forgot your password?"}</u></b>
                                </div>
                                <Form.Label className="text-white cursor-pointer">
                                    Show password <Checkbox className="ml-3 checkbox-white" size="md" onChange={(e)=>setShowPassword(e.target.checked)} checked={showPassword} />
                                </Form.Label>
                            </div>
                        </div>
                        <div className="flex flex-col mt-10 items-center w-full">
                            <Input type="submit" value={loading?"Loading":recoverPassword?"Reset password":"Login"} className={`btn btn-primary btn-wide ${loading?"opacity-40 btn-warning":""}`} onClick={checkErrors} disabled={loading} />
                        </div>
                    </div>
                </Card>
            </Form>
            
        </AppMain>
    );
}

