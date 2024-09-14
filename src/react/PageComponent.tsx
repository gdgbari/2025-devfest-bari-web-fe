import { useEffect } from "react";
import { AppMain } from "./AppMain";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";

export type PageData = { page: "login" } | { page: "signup"} | { page: "null" }

export const PageComponent = (props:PageData) => {

    const registrationToken = (new URLSearchParams(location.search).get("token"))??(location.pathname.match(/\/[^\/]*\/(?<token>.*)/)?.groups?.token)

    const pageComponent = () => {
        if(props.page === "login") {
            return <LoginPage />
        }
        if(props.page === "signup" && registrationToken) {
            return <SignupPage token={registrationToken} />
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