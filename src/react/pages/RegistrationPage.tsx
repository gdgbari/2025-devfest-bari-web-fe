import { AppMain } from "../AppMain";

export const RegsitrationPage = ({ token }:{
    token: string
}) => {
    return (
        <AppMain>
            registration token: {token}
        </AppMain>
    );
}