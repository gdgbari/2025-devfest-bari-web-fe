import { AppMain } from "../AppMain";

export const RegsitrationPage = ({ token }: { token:string }) => {

    if(!token) {
        return <AppMain>Invalid token</AppMain>
    }
    return (
        <AppMain>
            registration token: {token}
        </AppMain>
    );
}