import { useEffect } from "react";
import { AppMain } from "./AppMain";
import { LoginPage } from "./pages/LoginPage";
import { RegsitrationPage } from "./pages/RegistrationPage";

export type PageData = { page: "login" } | { page: "registration"} | { page: "null" }

export const PageComponent = (props:PageData) => {

    const registrationToken = new URLSearchParams(location.search).get("token")
    
    const pageComponent = () => {
        if(props.page === "login") {
            return <LoginPage />
        }
        if(props.page === "registration" && registrationToken) {
            return <RegsitrationPage token={registrationToken} />
        }
        return null
    }

    const content = pageComponent()

    useEffect(() => {
        if(!content) {
            location.href = "/"
        }
    }, [content])
    
    return <AppMain>
        {content}
    </AppMain>
}