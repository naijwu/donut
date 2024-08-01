import Button from '@/components/Button/Button'
import DonutBanner from '@/components/DonutBanner/DonutBanner'
import { List_DonutCols } from '@/lib/maps'
import { useRouter } from 'next/navigation'
import styles from './DonutChat.module.css'

export default function DonutChatScreen({
    donut
}: {
    donut: any[]
}) {
    const router = useRouter();

    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                <DonutBanner partial={{
                    donutID: donut[List_DonutCols.donutID],
                    createdAt: donut[List_DonutCols.createdAt],
                    isCompleted: donut[List_DonutCols.isCompleted],
                    groupName: donut[List_DonutCols.groupName],
                    members: [
                        {
                            email: donut[List_DonutCols.member1],
                            pictureURL: donut[List_DonutCols.member1picture],
                            fullName: donut[List_DonutCols.member1name],
                        },
                        {
                            email: donut[List_DonutCols.member2],
                            pictureURL: donut[List_DonutCols.member2picture],
                            fullName: donut[List_DonutCols.member2name],
                        }
                    ]
                }} />
                <div className={styles.tray}>
                    <Button size="medium" variant="solid" onClick={()=>router.push(`/donuts/${donut[List_DonutCols.donutID]}/post`)}>
                        Edit my post
                    </Button>
                    <Button size="medium" variant="solid" onClick={()=>{}}>
                        Mark complete
                    </Button>
                </div>
            </div>
            donut chatroom
        </div>
    )
}