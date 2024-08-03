
/**
 * threadNodes -> array of threadNode
 * threadNode -> nodes of the tree-ified comments data
 */

import styles from './Threads.module.css'
import { ThreadData } from "@/lib/types"
import Avatar from "../Avatar/Avatar"
import { P } from '../Typography/Typography'
import Button from '../Button/Button'
import { readableDate } from '../DonutBanner/DonutBanner'
import Reaction from '../Reaction/Reaction'
import { useAuthContext } from '@/utility/Auth'
import { useState } from 'react'
import axios from 'axios'
import { deltaTime } from '@/utility/helpers'

export default function Threads({
    threadNodes,
    onReply
}: {
    threadNodes?: any;
    onReply?: any
}) {

    const { user } = useAuthContext();

    return (
        <div className={styles.wrapper}>
            {threadNodes?.map((n: any) => (
                <ThreadNode key={n.threadID} node={n} onReply={onReply} user={user} />
            ))}
        </div>
    )
}

function ThreadNode({
    node,
    onReply,
    user
}: {
    node: any;
    onReply?: any;
    user?: any;
}) {
    return (
        <Thread data={node} onReply={onReply} user={user} >
            {node.children?.length > 0 && (
                <div className={styles.replies}>
                    {node.children?.map((reply: any, ind: number) => (
                        <ThreadNode key={reply.threadID} node={reply} onReply={onReply} user={user} />
                    ))}
                </div>
            )}
        </Thread>
    )
}

function Thread({
    data,
    children,
    onReply,
    user
}: {
    data: ThreadData;
    children?: any;
    onReply?: any;
    user?: any;
}) {
    const [reactions, setReactions] = useState<string[]>(Object.keys(data.reactions || {}))
    const [reactionsData, setReactionsData] = useState<any>(data.reactions);

    const [loading, setLoading] = useState<boolean>(false);

    function updateLocalReactions(e: string, profile: string) {
        const updatedReactions = JSON.parse(JSON.stringify(reactions));
        const updatedReactionsData = JSON.parse(JSON.stringify(reactionsData));
        if (updatedReactions.includes(e)) {
            // either + or - an existing e
            if (updatedReactionsData[e].profiles.includes(profile)) {
                // -
                if (updatedReactionsData[e].count == 1) {
                    // go to 0
                    delete updatedReactionsData[e];
                    updatedReactions.splice(reactions.indexOf(e));
                } else {
                    // decrement
                    updatedReactionsData[e].count -= 1;
                    // remove user from array
                    updatedReactionsData[e].profiles.splice(updatedReactionsData[e].profiles.indexOf(profile), 1);
                }
            } else {
                // +
                // increment
                updatedReactionsData[e].count += 1;
                // add user to array
                updatedReactionsData[e].profiles.push(profile);
            }
        } else {
            // new e
            updatedReactions.push(e)
            updatedReactionsData[e] = {
                count: 1,
                profiles: [profile]
            }
        }
        setReactions(updatedReactions);
        setReactionsData(updatedReactionsData);
    }

    async function handleReaction(e: string) {
        if (loading || !user) return;
        setLoading(true);

        // responsive ux good -> mock server changes using local/client state variables
        updateLocalReactions(e, user.email);

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/threads/reaction/${data.threadID}`, 
            {
                reaction: {
                    profile: user.email,
                    emoji: e
                }
            }, {
                withCredentials: true
            })
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    return (
        <div className={styles.thread}>
            <div className={styles.threadInner}>
                <Avatar size="small" name={data.profile.fullName} pictureURL={data.profile.pictureURL} />
                <div className={styles.content}>
                    <div className={styles.poster}>
                        <P small dark bold>
                            {/* {data.author.split('@')[0]} */}
                            {data.profile.fullName}
                        </P>
                        <P small>
                            &middot;
                        </P>
                        <P small>
                            {deltaTime(data.createdAt)}
                        </P>
                    </div>
                    <div className={styles.comment}>
                        <P dark>
                            {data.text}
                        </P>
                    </div>
                    <div className={styles.reactions}>
                        {reactions?.map((emoji) => (
                            <Button key={emoji} active={user && reactionsData[emoji] && (reactionsData[emoji].profiles.includes(user.email))} onClick={()=>handleReaction(emoji)} variant="ghost" size="small">
                                {emoji} {reactionsData[emoji].count}
                            </Button>
                        ))}
                        <Reaction onClick={(e)=>handleReaction(e)} />
                        <Button onClick={()=>onReply(data.profile.fullName, data.threadID)} variant="ghost" size="small">
                            Reply
                        </Button>
                    </div>
                </div>
            </div>

            {/* replies are here */}
            {children}
        </div>
    )
}