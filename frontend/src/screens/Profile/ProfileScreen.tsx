import Avatar from "@/components/Avatar/Avatar";
import Logout from "@/components/Logout";
import { Header1, Title } from "@/components/Typography/Typography";
import { useAuthContext } from "@/utility/Auth"


export default function ProfileScreen() {

    const { user } = useAuthContext();

    return (
        <div>
            <Title>
                Profile
            </Title>
            <Avatar pictureUrl={user.picture} size="xlarge" />
            <Header1>
                {user.name}
            </Header1>
            <Logout />
        </div>
    )
}