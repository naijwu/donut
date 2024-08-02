
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

export default function Threads({
    threadNodes,
    onReply
}: {
    threadNodes?: any;
    onReply?: any
}) {

    return (
        <div className={styles.wrapper}>
            {threadNodes?.map((n: any) => (
                <ThreadNode key={n.threadID} node={n} onReply={onReply} />
            ))}
        </div>
    )
}

function ThreadNode({
    node,
    onReply
}: {
    node: any;
    onReply?: any;
}) {
    return (
        <Thread data={node} onReply={onReply} >
            {node.children?.length > 0 && (
                <div className={styles.replies}>
                    {node.children?.map((reply: any, ind: number) => (
                        <ThreadNode key={reply.threadID} node={reply} onReply={onReply} />
                    ))}
                </div>
            )}
        </Thread>
    )
}

function Thread({
    data,
    children,
    onReply
}: {
    data: ThreadData;
    children?: any;
    onReply?: any;
}) {
    const reactions = Object.keys(data.reactions || {})

    return (
        <div className={styles.thread}>
            <div className={styles.threadInner}>
                <Avatar size="small" name={data.profile.fullName} pictureURL={data.profile.pictureURL} />
                <div className={styles.content}>
                    <div className={styles.poster}>
                        <P small dark bold>
                            {data.author.split('@')[0]}
                        </P>
                        <P small>
                            &middot;
                        </P>
                        <P small>
                            {readableDate(data.createdAt)}
                        </P>
                    </div>
                    <div className={styles.comment}>
                        <P dark>
                            {data.text}
                        </P>
                    </div>
                    <div className={styles.reactions}>
                        {reactions?.map((emoji) => (
                            <Button key={emoji} active onClick={()=>console.log(`add ${emoji} reaction`)} variant="ghost" size="small">
                                {emoji} {data.reactions[emoji]}
                            </Button>
                        ))}
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