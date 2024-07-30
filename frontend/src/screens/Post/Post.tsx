"use client"

import Author from '@/components/Author/Author'
import Button from '@/components/Button/Button'
import DonutBanner from '@/components/DonutBanner/DonutBanner'
import Tag from '@/components/Tag/Tag'
import Threads from '@/components/Threads/Threads'
import { Header1, P } from '@/components/Typography/Typography'
import { Donut, DonutPost, ThreadNodeList } from '@/lib/types'
import { useEffect, useState } from 'react'
import styles from './Post.module.css'

type PostT = {
    donut: Donut,
    post: DonutPost,
    threads: any[]
}

export default function Post({
    donut,
    post,
    threads
}: PostT) {
    const [threadNodes, setThreadNodes] = useState<ThreadNodeList>()

    // this is such a fucking tight piece of code i love it
    const listToTree = () => {
        const  threadList = threads;
        const map: any = {};
        const roots: any = [];
        let node: any;

        for (let i = 0; i < threadList.length; i++) {
            map[threadList[i].threadID] = i
            threadList[i].children = []
        }

        for (let i = 0; i < threadList.length; i++) {
            node = threadList[i]
            if(node.parentID !== null) {
                threadList[map[node.parentID]].children?.push(node)
            } else {
                roots.push(node)
            }
        }

        setThreadNodes(roots);
    }
    useEffect(() => {

        listToTree();
    }, [])

    return (
        <div className={styles.wrapper}>
            <DonutBanner partial={donut} />
            <div className={styles.post}>
                <div>
                    <Tag type="social" />
                </div>
                <Header1>
                    {post.title}
                </Header1>
                <P>
                    {post.description}
                </P>
                <div style={{height: 200,width:'100%',backgroundColor:'var(--color-ui-10)',borderRadius:10}}></div>
                <Author author={post.author} createdAt={post.createdAt} />
                <div className={styles.reactions}>
                    <Button active onClick={()=>console.log('reaction')} variant="ghost" size="small">
                        😍 23
                    </Button>
                    <Button onClick={()=>console.log('reaction')} variant="ghost" size="small">
                        😂 18
                    </Button>
                </div>
            </div>
            <div className={styles.comments}>
                <P small dark>
                    Comments
                </P>
                <Threads threadNodes={threadNodes} />
            </div>
            <div className={styles.commentField}>
                <input type="text" placeholder="Add a comment..." />
            </div>
        </div>
    )
}