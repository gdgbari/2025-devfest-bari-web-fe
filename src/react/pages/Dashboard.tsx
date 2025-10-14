import type { UserProfile } from "../utils/types"


type DashboardProps = {
    user: UserProfile
}

export const Dashboard = ({ user }: DashboardProps) => {
    return <div>
        Dashboard - coming soon {JSON.stringify(user)}
    </div>

}