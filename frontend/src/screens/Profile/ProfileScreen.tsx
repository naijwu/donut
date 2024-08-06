import Avatar from "@/components/Avatar/Avatar";
import Button from "@/components/Button/Button";
import Logout from "@/components/Logout";
import { Header1, P, Subtitle, Title } from "@/components/Typography/Typography";
import { ProfileCols } from "@/lib/maps";
import { useAuthContext } from "@/utility/Auth";
import { useRouter } from "next/navigation";
import { useState } from 'react';
import styles from './ProfileScreen.module.css';
import axios from 'axios';

export default function ProfileScreen({ profile, hobbies }: { profile?: any[], hobbies?: any[] }) {
    const { user } = useAuthContext();
    const router = useRouter();
    const [donutCount, setDonutCount] = useState<any>(0);
    const [countToggle, setCountToggle] = useState<boolean>(false);
    const [date, setDate] = useState('');

    async function handleToggle() {
        if (date) {
            try {
                console.log(date, typeof(date));
                const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${user.email}/${date}/donutCount`, {
                    withCredentials: true
                });
                console.log('Donut Count Updated');
                setCountToggle(true);
                setDonutCount(res.data[0] ? res.data[0][1] : 0);
            } catch (err) {
                console.error(err);
            }
        } else {
            alert("Please select a date");
        }
    }

    return profile ? (
        <div className={styles.wrapper}>
            <Title>Profile</Title>
            <div className={styles.container}>
                <div className={styles.about}>
                    <Avatar pictureURL={profile[ProfileCols.pictureURL]} size="xlarge" />
                    <Header1>{profile[ProfileCols.fullName]}</Header1>
                    <P>{profile[ProfileCols.email]}</P>
                </div>

                <div className={styles.info}>
                    <P dark>
                        @{profile[ProfileCols.username] || '(No username)'}
                    </P>
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
                    <Subtitle>
                        Hobbies
                    </Subtitle>
                    <div>
                        {hobbies?.map((hobby) => (
                            <div key={hobby[1]}>{hobby[1]}</div>
                        ))}
                    </div>
                </div>
                <div className={styles.donutCount}>
                    <Subtitle>
                        Explore
                    </Subtitle>
                    <P>
                        View the number of donuts in a given year and month that you have been in.
                    </P>
                    <div className={styles.dateSelect}>
                        <label htmlFor="month">Select Year and Month: </label>
                        <input 
                            type="month" 
                            id="month" 
                            name="month" 
                            value={date} 
                            onChange={(e) => setDate(e.target.value)} 
                        />
                    </div>
                    <Button onClick={handleToggle} size="medium" variant="solid">
                        {countToggle ? 'Update Count' : 'Donut Count'}
                    </Button>
                    {countToggle ? (
                        <div className={styles.donutCountInfo}>
                            You have been in {donutCount} donuts!
                        </div>
                    ) : (
                        <div className={styles.donutCountInfo}>
                           
                        </div>
                    )}
                </div>
            </div>
            {profile[ProfileCols.email] == user?.email && (
                <div className={styles.floatie}>
                    <div className={styles.floatieInner}>
                        <Button onClick={() => router.push('/profile/edit')} size="medium" variant="solid">
                            Edit profile
                        </Button>
                        <Logout />
                    </div>
                </div>
            )}
        </div>
    ) : <><Logout /></>
}
