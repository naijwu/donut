import Logout from "@/components/Logout";
import { Header1 } from "@/components/Typography/Typography";
import { useAuthContext } from "@/utility/Auth"


export default function ProfileScreen() {

    const { user } = useAuthContext();

    return (
        <div>
            <Header1>
                Profile
            </Header1>
            {JSON.stringify(user)}
            <Logout />
        </div>
    )
}