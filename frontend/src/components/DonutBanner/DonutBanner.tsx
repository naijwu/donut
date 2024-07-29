import { Donut, User } from '@/lib/types'
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
                    {partial?.members?.map((u: User) => (
                        <Avatar key={u.pictureUrl} name={u.fullName} pictureUrl={u.pictureUrl} />
                    ))}
                </Avatars>
                <div className={styles.donutAbout}>
                    <P bold small>
                        Yesterday
                        {/* data?.createdAt */}
                    </P>
                    <P>
                        &middot;
                    </P>
                    <P small>
                        Donut Group
                        {/* data?.name */}
                    </P>
                </div>
            </div>
        </div>
    )
}