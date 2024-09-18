import { AppMain } from "../AppMain";
import { Card, Checkbox, Form, Input } from "react-daisyui"
import { useForm } from "@mantine/form"
import { useEffect, useState } from "react";
import { notifications, showNotification } from "@mantine/notifications";
import { isEmailValid } from "../utils";
import { useFirebaseUserInfo } from "../utils/query";
import { WebsiteConfig } from "../../config";
import { useTranslations } from "../../i18n/utils";

export const SignupPage = ({ token }: { token:string }) => {
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

    const form = useForm({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        validate: {
            email: (value) => value.length > 0? isEmailValid(value)? undefined: "The email given is invalid": "Email is required",
            password: (value) => value.length > 0? undefined: "Password is required",
            confirmPassword: (value, values) => value === values.password? undefined: "Passwords do not match"
        },
        validateInputOnChange: true,
        initialErrors: {
            email: "Email is required",
            password: "Password is required",
            confirmPassword: "Passwords do not match"
        }
    })

    const [showPasswords, setShowPasswords] = useState(false)
    const [loading, setLoading] = useState(false)

    const { user, hasLoaded } = useFirebaseUserInfo()
    useEffect(() => {
        if(user != null && hasLoaded) {
            location.href = "/app"
        }
    }, [user])

    if(!token) {
        return <AppMain>Invalid token</AppMain>
    }
    return (
        <AppMain>
            {/* <p>registration token: {token}</p> */}

            <Form onSubmit={form.onSubmit((data)=>{
                    const requestId = notifications.show({
                        loading: true,
                        title: "Signing up...",
                        message: "Please wait untils the registration is complete",
                        autoClose: false
                    })
                    setLoading(true)
                    fetch("http://127.0.0.1/fakeAPI")
                        .then((userInfo) => {
                            notifications.update({
                                id: requestId,
                                loading: false,
                                title: "Registration Completed",
                                message: `Welcome ${user?.displayName}`,
                                color: "green",
                                autoClose: true
                            })
                        }).catch((error) => {
                            notifications.update({
                                id: requestId,
                                loading: false,
                                title: `Registration error [${error.code}]`,
                                message: error.message,
                                color: "red",
                                autoClose: true
                            })
                        }).finally(() => {
                            setLoading(false)
                        })
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
                            
                            <Input placeholder="Password" type={showPasswords?"text":"password"} className="mt-3" {...form.getInputProps("password")} />
                            <Input placeholder="Confirm Password" type={showPasswords?"text":"password"} className="mt-3" {...form.getInputProps("confirmPassword")} />
                            <div className="flex w-full justify-end mt-2">
                                <Form.Label title="Show passwords">
                                    <Checkbox className="ml-3" size="md" onChange={(e)=>setShowPasswords(e.target.checked)} checked={showPasswords} />
                                </Form.Label>
                            </div>
                        </div>
                        <div className="flex flex-col mt-10 items-center w-full">
                        <Input type="submit" value={loading?"Loading":"Signup"} className={`btn btn-primary btn-wide ${loading?"opacity-40 btn-warning":""}`} onClick={checkErrors} disabled={loading} />
                        </div>
                    </div>
                </Card>
            </Form>
        </AppMain>
    );
}