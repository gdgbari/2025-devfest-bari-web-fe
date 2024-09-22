import { AppMain } from "../AppMain";
import { Card, Checkbox, Form, Input } from "react-daisyui"
import { useForm } from "@mantine/form"
import { useEffect, useState } from "react";
import { notifications, showNotification } from "@mantine/notifications";
import { isEmailValid } from "../utils";
import { WebsiteConfig } from "../../config";
import { useTranslations } from "../../i18n/utils";
import { AuthenticationRepository } from "../../data/repositories/authentication_repository";

enum SignUpPageStatus { Initial, InvalidToken, Ready, SignUpInProgress, SignUpError, SignUpComplete }

export const SignupPage = ({ token }: { token: string }) => {
    const t = useTranslations("en")
    const authRepository = new AuthenticationRepository();
    const [pageStatus, setPageStatus] = useState(SignUpPageStatus.Initial);
    const [showPasswords, setShowPasswords] = useState(false)

    useEffect(() => {
        if (pageStatus !== SignUpPageStatus.Initial) {
            return;
        } else if (token) {
            authRepository
                .checkToken(token)
                .then((tokenIsValid) => {
                    setPageStatus(tokenIsValid
                        ? SignUpPageStatus.Ready
                        : SignUpPageStatus.InvalidToken
                    );
                });
        } else {
            setPageStatus(SignUpPageStatus.InvalidToken);
        }
    }, [pageStatus, token]);


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
            email: (value) => value.length > 0 ? isEmailValid(value) ? undefined : "The email given is invalid" : "Email is required",
            password: (value) => value.length > 0 ? undefined : "Password is required",
            confirmPassword: (value, values) => value === values.password ? undefined : "Passwords do not match"
        },
        validateInputOnChange: true,
        initialErrors: {
            email: "Email is required",
            password: "Password is required",
            confirmPassword: "Passwords do not match"
        }
    })


    if (pageStatus === SignUpPageStatus.Initial) {
        return <AppMain><div></div></AppMain>
    } else if (pageStatus === SignUpPageStatus.InvalidToken) {
        return <AppMain>Invalid token</AppMain>
    }


    return (
        <AppMain>
            {/* <p>registration token: {token}</p> */}

            <Form onSubmit={form.onSubmit((data) => {
                const requestId = notifications.show({
                    loading: true,
                    title: "Signing up...",
                    message: "Please wait untils the sign up is complete",
                    autoClose: false
                })

                setPageStatus(SignUpPageStatus.SignUpInProgress);

                authRepository
                    .signInWithEmailAndPassword(data.email, data.password)
                    .then(() => {
                        notifications.update({
                            id: requestId,
                            loading: false,
                            title: "Sign up Completed",
                            message: `Welcome ${form.values.email}`,
                            color: "green",
                            autoClose: true
                        });
                        setPageStatus(SignUpPageStatus.SignUpComplete);

                        setTimeout(() => {
                            location.href = "/login";
                        }, 1500);

                    }).catch((error) => {
                        notifications.update({
                            id: requestId,
                            loading: false,
                            title: `Registration error [${error.code}]`,
                            message: error.message,
                            color: "red",
                            autoClose: true
                        });
                        setPageStatus(SignUpPageStatus.SignUpError);
                    });
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

                            <Input placeholder="Password" type={showPasswords ? "text" : "password"} className="mt-3" {...form.getInputProps("password")} />
                            <Input placeholder="Confirm Password" type={showPasswords ? "text" : "password"} className="mt-3" {...form.getInputProps("confirmPassword")} />
                            <div className="flex w-full justify-end mt-2">
                                <Form.Label title="Show passwords">
                                    <Checkbox className="ml-3" size="md" onChange={(e) => setShowPasswords(e.target.checked)} checked={showPasswords} />
                                </Form.Label>
                            </div>
                        </div>
                        <div className="flex flex-col mt-10 items-center w-full">
                            <Input
                                type="submit"
                                value={pageStatus == SignUpPageStatus.SignUpInProgress ? "Loading" : "Signup"}
                                className={`btn btn-primary btn-wide ${pageStatus == SignUpPageStatus.SignUpInProgress ? "opacity-40 btn-warning" : ""}`}
                                onClick={checkErrors}
                                disabled={pageStatus == SignUpPageStatus.SignUpInProgress} />
                        </div>
                    </div>
                </Card>
            </Form>
        </AppMain>
    );
}