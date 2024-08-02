import Button from '@/components/Button/Button'
import DonutBanner from '@/components/DonutBanner/DonutBanner'
import { List_DonutCols } from '@/lib/maps'
import { useAuthContext } from '@/utility/Auth'
import { useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from 'react'
import { ReadyState } from 'react-use-websocket'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'
import styles from './DonutChat.module.css'

const WS_URL = process.env.NEXT_PUBLIC_WS_SERVER_URL || 'ws://localhost:8080';

export default function DonutChatScreen({
    donut
}: {
    donut: any[]
}) {
    const router = useRouter();
    const { user } = useAuthContext();

    const [chat, setChat] = useState<string>('');

    const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL);

    useEffect(() => {
        if (lastMessage !== null) {
            console.log(lastMessage)
        }
    }, [lastMessage]);

    const handleMessage = () => {
        sendMessage(JSON.stringify({
            donutID: donut[List_DonutCols.donutID],
            profile: user.email,
            chat
        }));
        setChat('');
    }

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

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
            
            <span>The WebSocket is currently {connectionStatus}</span>

            <div className={styles.commentField}>
                <input value={chat} onChange={e=>setChat(e.target.value)} type="text" placeholder={"Send a message..."} />
                <Button 
                  disabled={readyState !== ReadyState.OPEN}
                  size="small" 
                  variant="ghost" 
                  onClick={handleMessage}>
                    Send
                </Button>
            </div>
        </div>
    )
}