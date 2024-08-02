"use client"

import { Donut, DonutPost } from '@/lib/types'
import SwipeAlerter from '@/utility/SwipeAlerter'
import Link from 'next/link'
import { useState } from 'react'
import Author from '../Author/Author'
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
    const reactions = Object.keys(data?.reactions || {})
    
    return (
        <div className={styles.postContainer}>
            <div className={styles.tag}>
                {/* <Tag type="social" /> */}
            </div>
            <Link href={`/post/${data.donutID}/${data.postOrder}`}>
                <div className={styles.content}>
                    <P bold>
                        {data?.title}
                    </P>
                    <P>
                        {data?.description}
                    </P>
                </div>
            </Link>
            <div className={styles.pictures}>
                <div style={{height: 200,width:'100%',backgroundColor:'var(--color-ui-10)',borderRadius:10}}></div>
            </div>
            <Author author={data.profile} createdAt={data.createdAt} />
            <div className={styles.reactions}>
                {reactions?.map((emoji) => (
                    <Button key={emoji} active onClick={()=>console.log(`add ${emoji} reaction`)} variant="ghost" size="small">
                        {emoji} {data.reactions[emoji]}
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default function DonutCard({
    data
}: {
    data: Donut
}) {
    
    const [activeIndex, setActiveIndex] = useState<number>(0);
    
    const maxIndex = (data?.posts?.length || 1) - 1;
    const indicators = Array((maxIndex + 1) || 0).fill('');

    const swipeLeft = () => {
        if (activeIndex == maxIndex) return
        setActiveIndex(activeIndex + 1);
    }
    const swipeRight = () => {
        if (activeIndex == 0) return
        setActiveIndex(activeIndex - 1);
    }
    
    return (
        <div className={styles.card}>
            <div className={styles.top}>
                <DonutBanner borderless partial={data} />
            </div>
            <div className={styles.cardInner} style={{
                transition: 'all 0.2s cubic-bezier(.62,.13,.15,.97)',
                transform: `translateX(calc(-100% * ${activeIndex}))`}}>
                <SwipeAlerter
                  onSwipeLeft={swipeLeft}
                  onSwipeRight={swipeRight}>
                    <div className={styles.horizontalScroll} style={{
                        width: `calc(100% * ${data.posts?.length})`,
                        display: 'grid',
                        gridTemplateColumns: `repeat(${data.posts?.length}, 1fr)`,
                    }}>
                        {data?.posts?.map((postData, index) => (
                            <div className={styles.postWrapper}>
                                <Post key={index} data={postData} />
                            </div>
                        ))}
                    </div>
                </SwipeAlerter>
            </div>
            <div className={styles.indicator}>
                {indicators.map((i,ind) => (
                    <div key={ind} className={`${styles.dot} ${ind == activeIndex ? styles.active : ''}`}></div>
                ))}
            </div>
        </div>
    )
}