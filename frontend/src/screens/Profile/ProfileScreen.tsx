import Avatar from "@/components/Avatar/Avatar";
import Button from "@/components/Button/Button";
import Logout from "@/components/Logout";
import { Header1, P, Title } from "@/components/Typography/Typography";
import { ProfileCols } from "@/lib/maps";
import { useAuthContext } from "@/utility/Auth"
import { useRouter } from "next/navigation";
import { useState } from 'react'
import styles from './ProfileScreen.module.css'
import axios from 'axios'

export default function ProfileScreen({
    profile,
    hobbies
}: {
    profile?: any[];
    hobbies?: any[];
}) {
    const { user } = useAuthContext();
    const router = useRouter();
    const [donutCount, setDonutCount] = useState<any>(0);
    const [countToggle, setCountToggle] = useState<boolean>(false);

    async function handleToggle() {
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${user.email}/donutCount`, {
                withCredentials: true
            })
            console.log('Donut Count Updated');
            setCountToggle(true);
            setDonutCount(res.data);
        } catch (err) {
            console.error(err)
        }
    }

    return profile ? (
        <div className={styles.wrapper}>
            <Title>
                Profile
            </Title>
            <div className={styles.container}>
                <div className={styles.about}>
                    <Avatar pictureURL={profile[ProfileCols.pictureURL]} size="xlarge" />
                    <Header1>
                        {profile[ProfileCols.fullName]}
                    </Header1>
                    <P>
                        {profile[ProfileCols.email]}
                    </P>
                </div>

                <div>
                    <button onClick={handleToggle}>
                        {countToggle ? 'Update Count' : 'Donut Count'}
                    </button>
                    {countToggle ? (
                        <div>
                            <P dark>Content is visible</P>
                            <P>This content is shown when countToggle is true.</P>
                        </div>
                    ) : (
                        <div>
                            <P dark>No Content</P>
                            <P>This content is shown when countToggle is false.</P>
                        </div>
                    )}
                </div>

                <div className={styles.info}>
                    <P dark>
                        🎓 {profile[ProfileCols.major] || '(No major)'} {profile[ProfileCols.year] || '(No year)'}
                    </P>
                    <P dark>
                        🎂 {profile[ProfileCols.age] || '(No age)'}
                    </P>
                    <P dark>
                        {profile[ProfileCols.gender] == 'Female' ? '♀' : '♂'} {profile[ProfileCols.gender] || '(No gender)'}
                    </P>
                    <P dark>
                        🍩 {profile[ProfileCols.enabled] == 1 ? 'Going on donuts!' : 'Currently not being assigned'}
                    </P>
                </div>
                <div className={styles.hobbies}>
                    <P bold>
                        Hobbies
                    </P>
                    <div>
                        {hobbies?.map((hobby) => (
                            <div>
                                {hobby[1]}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {profile[ProfileCols.email] == user?.email && (
                <div className={styles.floatie}>
                    <div className={styles.floatieInner}>
                        <Button onClick={()=>router.push('/profile/edit')} size="medium" variant="solid">
                            Edit profile
                        </Button>
                        <Logout />
                    </div>
                </div>
            )}
        </div>
    ) : <></>
}