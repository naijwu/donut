import Logout from "@/components/Logout";
import { useAuthContext } from "@/utility/Auth"


export default function ProfileScreen() {

    const { user } = useAuthContext();

    return (
        <div>
            {JSON.stringify(user)}
            <Logout />
        </div>
    )
}