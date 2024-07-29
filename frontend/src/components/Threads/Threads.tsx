
/**
 * threadNodes -> array of threadNode
 * threadNode -> nodes of the tree-ified comments data
 */

import Avatar from "../Avatar/Avatar"

type ThreadsT = {
    threadNodes?: any[]
}
type ThreadNodeT = {
    node: any
}
type ThreadT = {
    data: any,
    children?: any
}

export default function Threads({
    threadNodes
}: ThreadsT) {

    return (
        <div>
            {threadNodes?.map((thread, ind) => (
                <ThreadNode {...thread} />
            ))}
        </div>
    )
}

function ThreadNode({
    node,
}: ThreadNodeT) {
    return (
        <Thread data={node}>
            {node.children?.length > 0 && (
                <div>
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
}: ThreadT) {

    return (
        <div>
            <div>
                <Avatar />
                {JSON.stringify(data)}
            </div>

            {/* replies are here */}
            {children}
        </div>
    )
}