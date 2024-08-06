"use client"

import { Donut, DonutPost } from '@/lib/types'
import SwipeAlerter from '@/utility/SwipeAlerter'
import Link from 'next/link'
import { useState } from 'react'
import Author from '../Author/Author'
import Button from '../Button/Button'
import DonutBanner from '../DonutBanner/DonutBanner'
import Tag from '../Tag/Tag'
import { P } from '../Typography/Typography'
import styles from './DonutCard.module.css'

export function Post({
    onSwipeLeft,
    onSwipeRight,
    data,
}: {
    onSwipeLeft: any;
    onSwipeRight: any;
    data: DonutPost,
}) {
    const reactions = Object.keys(data?.reactions || {})
    
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const maxIndex = (data?.images?.length || 1) - 1;
    const swipeLeft = () => {
        if (activeIndex == maxIndex) return
        setActiveIndex(activeIndex + 1);
    }
    const swipeRight = () => {
        if (activeIndex == 0) return
        setActiveIndex(activeIndex - 1);
    }

    return (
        <div className={styles.postContainer}>
            <div className={styles.tag}>
                {/* <Tag type="social" /> */}
            </div>
            <SwipeAlerter
              onSwipeLeft={onSwipeLeft}
              onSwipeRight={onSwipeRight}>
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
            </SwipeAlerter>
            <SwipeAlerter
              onSwipeLeft={swipeLeft}
              onSwipeRight={swipeRight}>
                <div className={styles.pictures}>
                    <div style={{
                        transition: 'all 0.2s cubic-bezier(.62,.13,.15,.97)',
                        transform: `translateX(calc(-100% * ${activeIndex}))`}}>
                        <div style={{
                            width: `calc(100% * ${data.images?.length})`,
                            display: 'grid',
                            gridTemplateColumns: `repeat(${data.images?.length}, 1fr)`,
                        }}>
                            {data?.images?.map((img) => (
                                <img className={styles.postPicture} src={img.pictureURL} alt={img.alt} />
                            ))}
                        </div>
                    </div>
                </div>
            </SwipeAlerter>
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
                    <div className={styles.horizontalScroll} style={{
                        width: `calc(100% * ${data.posts?.length})`,
                        display: 'grid',
                        gridTemplateColumns: `repeat(${data.posts?.length}, 1fr)`,
                    }}>
                        {data?.posts?.map((postData, index) => (
                            <div key={index} className={styles.postWrapper}>
                                <Post 
                                    onSwipeLeft={swipeLeft}
                                    onSwipeRight={swipeRight}
                                    data={postData} />
                            </div>
                        ))}
                    </div>
            </div>
            {indicators?.length > 1 && (
                <div className={styles.indicator}>
                    {indicators.map((i,ind) => (
                        <div key={ind} className={`${styles.dot} ${ind == activeIndex ? styles.active : ''}`}></div>
                    ))}
                </div>
            )}
        </div>
    )
}