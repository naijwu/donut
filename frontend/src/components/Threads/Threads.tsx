
/**
 * threadNodes -> array of threadNode
 * threadNode -> nodes of the tree-ified comments data
 */

import styles from './Threads.module.css'
import { ThreadNode, ThreadData } from "@/lib/types"
import Avatar from "../Avatar/Avatar"
import { P } from '../Typography/Typography'
import Button from '../Button/Button'

export default function Threads({
    threadNodes
}: {
    threadNodes?: ThreadNode[]
}) {

    return (
        <div className={styles.wrapper}>
            {threadNodes?.map((n, ind) => (
                <ThreadNode node={n} />
            ))}
        </div>
    )
}

function ThreadNode({
    node,
}: {
    node: any
}) {
    return (
        <Thread data={node}>
            {node.children?.length > 0 && (
                <div className={styles.replies}>
                    {node.children?.map((reply: any, ind: number) => (
                        <Thread data={reply} />
                    ))}
                </div>
            )}
        </Thread>
    )
}

function Thread({
    data,
    children
}: {
    data: ThreadData,
    children?: any
}) {

    return (
        <div className={styles.thread}>
            <div className={styles.threadInner}>
                <Avatar size="small" name={data.author} pictureUrl={data.pictureUrl} />
                <div className={styles.content}>
                    <div className={styles.poster}>
                        <P small dark bold>
                            {data.author}
                        </P>
                        <P small>
                            &middot;
                        </P>
                        <P small>
                            {data.createdAt}
                        </P>
                    </div>
                    <div className={styles.comment}>
                        <P dark>
                            {data.text}
                        </P>
                    </div>
                    <div className={styles.reactions}>
                        <Button active onClick={()=>console.log('reaction')} variant="ghost" size="small">
                            😍 3
                        </Button>
                    </div>
                </div>
            </div>

            {/* replies are here */}
            {children}
        </div>
    )
}