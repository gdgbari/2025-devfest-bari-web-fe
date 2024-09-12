import { AppMain } from "./AppMain";
import { LoginPage } from "./pages/LoginPage";
import { RegsitrationPage } from "./pages/RegistrationPage";

export type PageData = { page: "login" } | { page: "registration", token: string } | { page: "null" }

export const PageComponent = (props:PageData) => {

    
    const pageComponent = () => {
        if(props.page === "login") {
            return <LoginPage />
        }
        if(props.page === "registration") {
            return <RegsitrationPage token={props.token} />
        }
        return null
    }
    
    return <AppMain>
        {pageComponent()}
    </AppMain>
}