import styles from './NotificationsScreen.module.css';
import { P, Title } from "@/components/Typography/Typography";
import { Notification } from "@/lib/types";
import Avatar from '@/components/Avatar/Avatar';
import { useAuthContext } from "@/utility/Auth";
import axios from "axios";

function NotificationUI({
    pictureURL,
    notificationID,
    time,
    message
}: {
    pictureURL: string;
    notificationID: string;
    time: any;
    message: string;
}) {
    const DEFAULT_PICTURE_URL = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png';

    const displayPictureURL = pictureURL || DEFAULT_PICTURE_URL;
    const handleDelete = async () => {
        try {
            await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/notifications/${notificationID}`);
            location.reload()
        } catch (err) {
            console.error("Failed to delete notification:", err);
        }
    };
    return (
        <div className={styles.notif} onClick={handleDelete}>
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
                            notificationID={notif[0]}
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
