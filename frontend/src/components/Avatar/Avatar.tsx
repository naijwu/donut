import Image from "next/image"
import styles from './Avatar.module.css'

type AvatarT = {
    name?: string,
    pictureUrl?: string,
    size?: 'medium' | 'small' | 'xlarge'
}

export function Avatars({
    children
}: {
    children?: any
}) {
    return (
        <div className={styles.group}>
            {children?.length > 0 ? children?.map((a: any,i: number)=>(
                <div key={i} className={styles.groupInner}>
                    {a}
                </div>
            )) : children}
        </div>
    )
}

export default function Avatar({
    name,
    pictureUrl,
    size = 'medium'
}: AvatarT) {
    return (
        <div className={`${styles.avatar} ${styles[`s_${size}`]}`}>
            {pictureUrl ? <Image src={pictureUrl} alt={name || "Avatar"} layout="fill" /> : (name ? name.substring(0, 1) : "")}
        </div>
    )

}