"use client"

import Author from '@/components/Author/Author'
import Button from '@/components/Button/Button'
import DonutBanner from '@/components/DonutBanner/DonutBanner'
import Tag from '@/components/Tag/Tag'
import Threads from '@/components/Threads/Threads'
import { Header1, P } from '@/components/Typography/Typography'
import { Donut, DonutPost } from '@/lib/types'
import styles from './Post.module.css'

type PostT = {
    donut: Donut,
    post: DonutPost
}

export default function Post({
    donut,
    post
}: PostT) {

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
                <Threads />
            </div>
        </div>
    )
}