import BellIcon from '@/icons/BellIcon'
import FoodIcon from '@/icons/FoodIcon'
import HomeIcon from '@/icons/HomeIcon'
import UserIcon from '@/icons/UserIcon'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import styles from './Navbar.module.css'

function TrayButton({
    active,
    link,
    children
}: {
    active?: boolean,
    link: string,
    children?: any
}) {
    return (
        <div className={`${styles.btn} ${active ? styles.active : ''}`}>
            <Link href={link}>
                {children}
            </Link>
        </div>
    )
}

export default function Navbar() {

    const pn = usePathname();

    return (
        <div className={styles.container}>
            <div className={styles.tray}>
                <TrayButton link="/" active={pn == '/'}>
                    <HomeIcon />
                </TrayButton>
                <TrayButton link="/notifications" active={pn?.includes('/notifications')}>
                    <BellIcon />
                </TrayButton>
                <TrayButton link="/donuts" active={pn?.includes('/donuts')}>
                    <FoodIcon />
                </TrayButton>
                <TrayButton link="/profile" active={pn?.includes('/profile')}>
                    <UserIcon />
                </TrayButton>
            </div>
        </div>
    )
}