import Avatar from '@/components/Avatar/Avatar'
import Button from '@/components/Button/Button'
import DonutBanner from '@/components/DonutBanner/DonutBanner'
import { P } from '@/components/Typography/Typography'
import { List_DonutCols } from '@/lib/maps'
import { useAuthContext } from '@/utility/Auth'
import { deltaTime, sqlifyDatetime } from '@/utility/helpers'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { ReadyState } from 'react-use-websocket'
import { useWebSocket } from 'react-use-websocket/dist/lib/use-websocket'
import { v4 as uuidv4 } from 'uuid'
import styles from './DonutChat.module.css'

const WS_URL = process.env.NEXT_PUBLIC_WS_SERVER_URL || 'ws://localhost:8080';

export default function DonutChatScreen({
    donut,
    chat
}: {
    donut: any[],
    chat: any[];
}) {
    const parsedDonut = {
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
    }
    
    const possibleSenders: any = {}
    possibleSenders[parsedDonut.members[0].email] = parsedDonut.members[0]
    possibleSenders[parsedDonut.members[1].email] = parsedDonut.members[1]

    const router = useRouter();
    const { user } = useAuthContext();

    const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL);
    const [text, setText] = useState<string>('');
    const [messages, setMessages] = useState<any[]>(chat || []);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (lastMessage !== null) {
            const newMessages = JSON.parse(JSON.stringify(messages));
            newMessages.push(JSON.parse(lastMessage.data));
            setMessages(newMessages);
            scrollToBottomChat();
            console.log(messages)
        }
    }, [lastMessage]);

    async function saveMessageToDB(message: any) {
        if (loading) return;
        setLoading(true);

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/donut/${donut[List_DonutCols.donutID]}/message`, {
                message
            }, {
                withCredentials: true
            })

            // Determine the receiver of the message
            const receiverEmail = Object.keys(possibleSenders).find(email => email !== message.sender);
    
            // Send a notification to the receiver
            if (receiverEmail) {
                await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/notifications/${receiverEmail}/${possibleSenders[message.sender].fullName} sent you ${message.message}`, {
                    message
                }, {
                    withCredentials: true
                })
            }

            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    }

    const bottomRef = useRef<HTMLDivElement>(null);
    function scrollToBottomChat() {
        if (bottomRef.current) {
            bottomRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }
    const handleMessage = async () => {
        // create values
        const messageID = uuidv4();
        const timestamp = new Date();

        const msgData = {
            messageID,
            donutID: donut[List_DonutCols.donutID],
            message: text,
            sqlFriendlyDate: sqlifyDatetime(timestamp),
            sentAt: timestamp,
            sender: user.email,
        }
        scrollToBottomChat();

        // save to db
        try {
            await saveMessageToDB(msgData);
        } catch (err) {
            console.error(err)
        }

        // update groupchat
        sendMessage(JSON.stringify(msgData));
        setText('');
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
                <DonutBanner partial={parsedDonut} />
                <div className={styles.tray}>
                    <Button size="medium" variant="solid" onClick={()=>router.push(`/donuts/${donut[List_DonutCols.donutID]}/post`)}>
                        Edit my post
                    </Button>
                    <Button size="medium" variant="solid" onClick={()=>{}}>
                        Mark complete
                    </Button>
                </div>
            </div>
            
            <div className={styles.messages}>
                {messages?.map((message, index: number) => (
                    <div key={message.messageID} className={styles.msg}>
                        <div>
                            {!(messages[index - 1] && messages[index - 1].sender == message.sender) && (
                                <Avatar size="small" pictureURL={possibleSenders[message.sender].pictureURL} />
                            )}
                        </div>
                        <div className={styles.msgRight}>
                            <div className={`${styles.msgMeta} ${(messages[index - 1] && messages[index - 1].sender == message.sender) ? styles.hide : ''}`}>
                                <P bold dark small>
                                    {possibleSenders[message.sender].fullName}
                                </P>
                                <P small>
                                    {deltaTime(message.sentAt)}
                                </P>
                            </div>
                            <P dark small>
                                {message.message}
                            </P>
                        </div>
                    </div>
                ))}
                <div style={{paddingTop: 76}} ref={bottomRef}></div>
            </div>

            <div className={styles.commentField}>
                <input value={text} onChange={e=>setText(e.target.value)} type="text" placeholder={"Send a message..."} />
                <Button 
                  disabled={(readyState !== ReadyState.OPEN) || loading}
                  size="small" 
                  variant="ghost" 
                  onClick={handleMessage}>
                    Send
                </Button>
            </div>
        </div>
    )
}