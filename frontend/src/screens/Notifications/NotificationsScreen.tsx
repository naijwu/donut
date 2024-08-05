import styles from './NotificationsScreen.module.css';
import { P, Title } from "@/components/Typography/Typography";
import { Notification } from "@/lib/types";
import Avatar from '@/components/Avatar/Avatar';
import { useAuthContext } from "@/utility/Auth";

function NotificationUI({
    pictureURL,
    time,
    message
}: {
    pictureURL: string;
    time: any;
    message: string;
}) {
    const DEFAULT_PICTURE_URL = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';

    const displayPictureURL = pictureURL || DEFAULT_PICTURE_URL;

    return (
        <div className={styles.notif}>
            <div>
                <Avatar pictureURL={displayPictureURL} />
            </div>
            <div className={styles.content}>
                <P dark>
                    {message}
                </P>
                <p className={styles.time}>
                    {time}
                </p>
            </div>
        </div>
    );
}


export default function NotificationsScreen({
    notifications
}: {
    notifications: Notification[]
}) {

    const { user } = useAuthContext();

    return (
        <div>
            <Title>
                Notifications
            </Title>
            {notifications && notifications.length > 0 ? (
                <div className={styles.container}>
                    {notifications.map((notif) => (
                        <NotificationUI 
                            key={notif[0]} 
                            time={notif[1]} 
                            message={notif[2]} 
                        />
                    ))}
                </div>
            ) : (
                <P dark>
                    You do not have any notifications to display!
                </P>
            )}
        </div>
    );
}
