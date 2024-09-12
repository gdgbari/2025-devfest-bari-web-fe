import { AppMain } from "../AppMain";
import { Card, Input } from "react-daisyui"
import { useForm } from "@mantine/form"
import { WebsiteConfig } from "../../config";
import { useTranslations } from "../../i18n/utils";
import { showNotification } from "@mantine/notifications";
import { isEmailValid } from "../utils";

export const LoginPage = () => {
    const form = useForm({
        initialValues: {
            email: "",
            password: ""
        },
        validate: {
            email: (value) => value.length > 0? isEmailValid(value)? undefined: "The email given is invalid": "Email is required",
            password: (value) => value.length > 0? undefined: "Password is required"
        },
        validateInputOnChange: true
        
    })

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

    return (
        <AppMain>
            <form onSubmit={form.onSubmit((data)=>{
                    showNotification({
                        title: "Function not implemented",
                        message: JSON.stringify(data),
                        color: "blue"
                    })
                })
            }>
                <Card className="md:px-20 md:py-16 bg-black bg-opacity-80 z-10 md:h-fit md:w-fit h-screen w-screen justify-center rounded-none px-5 md:rounded-xl">
                    <div className="flex flex-col opacity-100 justify-center items-center">
                        <img src="/assets/vectors/logo_big.svg" className="h-36 m-2 px-8 md:p-0 md:m-6" />
                        <p className="text-2xl md:text-3xl font-semibold mt-5">
                            {
                            WebsiteConfig.EVENT_START.toLocaleDateString("en", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })
                            }
                        </p>
                        <p className="text-2xl md:text-3xl font-semibold">{t("info.locationName")}</p>
                        <div className="flex flex-col mt-10 w-full">
                            <Input placeholder="Email" {...form.getInputProps("email")} />
                            <Input placeholder="Password" className="mt-3" {...form.getInputProps("password")} />
                        </div>
                        <div className="flex flex-col mt-10 items-center w-full">
                        <Input type="submit" value="Login" className="btn btn-primary btn-wide" onClick={checkErrors} />
                        </div>
                    </div>
                </Card>
            </form>
            
        </AppMain>
    );
}

