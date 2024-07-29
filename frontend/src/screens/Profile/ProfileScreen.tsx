import Logout from "@/components/Logout";
import { Title } from "@/components/Typography/Typography";
import { useAuthContext } from "@/utility/Auth"


export default function ProfileScreen() {

    const { user } = useAuthContext();

    return (
        <div>
            <Title>
                Profile
            </Title>
            {JSON.stringify(user)}
            <Logout />
        </div>
    )
}