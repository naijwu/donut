import styles from './NotificationsScreen.module.css'
import { P, Title } from "@/components/Typography/Typography";
import { Notification } from "@/lib/types";
import Avatar from '@/components/Avatar/Avatar';

function Notification({
    causer,
    pictureUrl,
    time,
    message
}: {
    causer: string;
    pictureUrl: string;
    time: any;
    message: string
}) {
    return (
        <div className={styles.notif}>
            <div>
                <Avatar pictureUrl={pictureUrl} />
            </div>
            <div className={styles.content}>
                <P dark>
                    {message}
                </P>
                <P small>
                    {time}
                </P>
            </div>
        </div>
    )
}

export default function NotificationsScreen({
    notifications
}: {
    notifications: Notification[]
}) {
    return (
        <div>
            <Title>
                Notifications
            </Title>
            <div className={styles.container}>
                {notifications?.map((notif) => <Notification key={notif.notificationID} {...notif} />)}
            </div>
        </div>
    )
}