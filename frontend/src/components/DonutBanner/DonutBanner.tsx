import { Donut, Profile } from '@/lib/types'
import Avatar, { Avatars } from '../Avatar/Avatar'
import { P } from '../Typography/Typography'
import styles from './DonutBanner.module.css'

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
                        {partial?.name}
                    </P>
                    <P>
                        &middot;
                    </P>
                    <P small>
                        {partial?.createdAt}
                    </P>
                </div>
            </div>
        </div>
    )
}