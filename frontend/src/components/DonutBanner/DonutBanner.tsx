import { Donut, Profile } from '@/lib/types'
import Avatar, { Avatars } from '../Avatar/Avatar'
import { P } from '../Typography/Typography'
import styles from './DonutBanner.module.css'

export const readableDate = (date: string) => {
    const months = ['','Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct','Nov', 'Dec']
    const year = date.substring(0, 4);
    const month = parseInt(date.substring(5, 7));
    const day = parseInt(date.substring(8, 10));
    return `${months[month]} ${day}`
}

export default function DonutBanner({
    borderless = false,
    partial
}: {
    borderless?: boolean,
    partial: Donut
}) {

    return (
        <div className={`${styles.container} ${borderless ? styles.borderless : ''}`}>
            <div className={styles.top}>
                <Avatars>
                    {partial?.members?.map((u: Profile) => (
                        <Avatar key={u.pictureURL} name={u.fullName} pictureURL={u.pictureURL} />
                    ))}
                </Avatars>
                <div className={styles.donutAbout}>
                    <P bold small>
                        {partial?.groupName || 'New Donut'}
                    </P>
                    <P>
                        &middot;
                    </P>
                    <P small>
                        {readableDate(partial?.createdAt)}
                    </P>
                </div>
            </div>
        </div>
    )
}