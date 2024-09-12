import { AppMain } from "../AppMain";
import { Button, Card, Input } from "react-daisyui"
import { useForm } from "@mantine/form"
import Jumbo from "../../components/Home/Jumbo.astro";
import { WebsiteConfig } from "../../config";
import { useTranslations } from "../../i18n/utils";
import { showNotification } from "@mantine/notifications";

export const LoginPage = () => {
    const form = useForm({
        initialValues: {
            email: "",
            password: ""
        },
        validate: {
            email: (value) => value.length > 0,
            password: (value) => value.length > 0
        }
    })

    const t = useTranslations("en")

    return (
        <AppMain>
            <form onSubmit={form.onSubmit((data)=>{
                showNotification({
                    title: "Function not implemented",
                    message: JSON.stringify(data),
                    color: "blue"
                })
            })}>
                <Card className="px-20 py-16 bg-black bg-opacity-80 z-10">
                    <div className="flex flex-col opacity-100 justify-center items-center">
                        <img src="/assets/vectors/logo_big.svg" className="h-36 m-2 md:m-6" />
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
                        <div className="flex flex-col mt-10" style={{ width: "100%"}}>
                            <Input placeholder="Email" {...form.getInputProps("email")} />
                            <Input placeholder="Password" className="mt-3" {...form.getInputProps("password")} />
                        </div>
                        <div className="flex flex-col mt-10 items-center" style={{ width: "100%"}}>
                        <Input type="submit" value="Login" className="btn btn-primary btn-wide" />
                        </div>
                    </div>
                </Card>
            </form>
            
        </AppMain>
    );
}

