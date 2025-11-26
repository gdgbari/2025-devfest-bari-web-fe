import { Card } from "react-daisyui"
import { WebsiteConfig } from "../../config"
import { useTranslations } from "../../i18n/utils"

interface LoadingScreenProps {
    message?: string
    showHeader?: boolean
}

export const LoadingScreen = ({ message = "Caricamento in corso", showHeader = true }: LoadingScreenProps) => {
    const t = useTranslations("en")

    return (
        <div className="flex items-center justify-center min-h-screen w-full">
            <Card className="md:px-20 md:py-16 bg-black md:bg-opacity-60 bg-opacity-25 z-10 md:h-fit md:w-fit h-screen w-screen justify-center rounded-none px-5 md:rounded-xl">
                <div className="flex flex-col opacity-100 justify-center items-center">
                    {showHeader && (
                        <>
                            {/* Logo */}
                            <img
                                src="/assets/vectors/logo_big.svg"
                                className="h-36 m-2 px-8 md:p-0 md:m-6"
                            />

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
                        </>
                    )}

                    {/* Simple Loading Animation */}
                    <div className={`flex flex-col ${showHeader ? 'mt-10' : ''} items-center justify-center w-full gap-6`}>
                        {/* Single spinner - larger */}
                        <div className="loading loading-spinner w-16 h-16 text-primary"></div>

                        {/* Simple message */}
                        <p className="text-xl opacity-70">
                            {message}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    )
}
