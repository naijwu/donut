"use client"

import { Donut, DonutPost } from '@/lib/types'
import { useState } from 'react'
import Avatar, { Avatars } from '../Avatar/Avatar'
import Button from '../Button/Button'
import DonutBanner from '../DonutBanner/DonutBanner'
import Tag from '../Tag/Tag'
import { P } from '../Typography/Typography'
import styles from './DonutCard.module.css'

export function Post({
    data,
}: {
    data: DonutPost,
}) {
    
    return (
        <div className={styles.postContainer}>
            <div className={styles.tag}>
                <Tag type="social" />
            </div>
            <div className={styles.content}>
                <P bold>
                    {data?.title}
                </P>
                <P>
                    {data?.description}
                </P>
            </div>
            <div className={styles.pictures}>
                <div style={{height: 200,width:'100%',backgroundColor:'var(--color-ui-10)',borderRadius:10}}></div>
            </div>
            <div className={styles.author}>
                <Avatar pictureUrl='https://lh3.googleusercontent.com/a/ACg8ocLg2Dv28OPh2nV0uWRhctqkHMTSpuEybGqCtFc-jxDmP8OhuaoqMA=s96-c' />
                <div className={styles.author_text}>
                    <P small bold>
                        {data.author}
                    </P>
                    <P small>
                        on
                    </P>
                    <P bold small>
                        {data.createdAt}
                    </P>
                </div>
            </div>
            <div className={styles.reactions}>
                {/* TODO: reactions from array */}
                <Button active onClick={()=>console.log('reaction')} variant="ghost" size="small">
                    😍 23
                </Button>
                <Button onClick={()=>console.log('reaction')} variant="ghost" size="small">
                    😂 18
                </Button>
            </div>
        </div>
    )
}

export default function DonutCard({
    data
}: {
    data: Donut
}) {
    
    const [viewIndex, setViewIndex] = useState<number>(0);
    
    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <DonutBanner borderless partial={data} />
            </div>
            <div className={styles.cardInner}>
                <div className={styles.horizontalScroll} style={{
                    width: `calc(100% * ${data.posts?.length})`,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${data.posts?.length}, 1fr)`
                }}>
                    {data?.posts?.map((postData, index) => (
                        <div className={styles.postWrapper}>
                            <Post key={index} data={postData} />
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.indicator}>
                    
            </div>
        </div>
    )
}