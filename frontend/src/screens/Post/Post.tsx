"use client"

import Author from '@/components/Author/Author'
import Button from '@/components/Button/Button'
import DonutBanner from '@/components/DonutBanner/DonutBanner'
import Reaction from '@/components/Reaction/Reaction'
import Tag from '@/components/Tag/Tag'
import Threads from '@/components/Threads/Threads'
import { Header1, P } from '@/components/Typography/Typography'
import { Donut, DonutPost, ThreadNodeList } from '@/lib/types'
import { useAuthContext } from '@/utility/Auth'
import SwipeAlerter from '@/utility/SwipeAlerter'
import axios from 'axios'
import { useEffect, useState } from 'react'
import styles from './Post.module.css'

type PostT = {
    data: {
        donutID: string;
        postOrder: number;
        title: string;
        createdAt: string;
        description: string;
        author: string;
        profile: {
            email: string;
            pictureURL: string;
            fullName: string
        };
        donut: {
            donutID: string;
            createdAt: string;
            isCompleted: number;
            course: string;
            suggestedActivity: string;
            groupName: string;
        }
        images: {
            pictureURL: string;
            alt: string;
        }[];
        threads: {
            threadID: string;
            author: string;
            parent: string;
            text: string;
            createdAt: string;
            profile: {
                email: string;
                pictureURL: string;
                fullName: string;
            }
        }[];
        reactions: any;
    }
}

export default function Post({
    data
}: PostT) {
    const [reactions, setReactions] = useState<string[]>(Object.keys(data.reactions || {}))
    const [reactionsData, setReactionsData] = useState<any>(data.reactions);

    const { user } = useAuthContext();

    const [refresh, setRefresh] = useState<boolean>(false);
    async function loadThreads() {
        try {
          const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/threads/${data.donutID}/${data.postOrder}`, {
            withCredentials: true
          });
          listToTree(res.data.data)
        } catch (err) {
          console.error(err);
        }
    }

    // this is such a fucking tight piece of code i love it
    const [threadNodes, setThreadNodes] = useState<ThreadNodeList>()
    function listToTree (threadsArray: any[]) {
        const threadList: any = threadsArray;
        const map: any = {};
        const roots: any = [];
        let node: any;

        for (let i = 0; i < threadList.length; i++) {
            map[threadList[i].threadID] = i
            threadList[i].children = []
        }

        for (let i = 0; i < threadList.length; i++) {
            node = threadList[i]
            if(node.parent !== null) {
                threadList[map[node.parent]].children?.push(node)
            } else {
                roots.push(node)
            }
        }

        // console.log(roots)
        setThreadNodes(roots);
    }

    useEffect(() => {
        loadThreads()
    }, [refresh])
    
    // img carousel thing
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

    // comments
    const [loading, setLoading] = useState<boolean>(false);
    const [comment, setComment] = useState<string>('');
    const [replyTo, setReplyTo] = useState<string[]>([]);
    async function handleThread() {
        if(loading || !user) return;
        setLoading(true);

        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/threads/${data.donutID}/${data.postOrder}`, {
                thread: {
                    text: comment,
                    author: user.email,
                    parent: replyTo?.length == 2 ? replyTo[1] : undefined
                }
            }, {
                withCredentials: true
            })
            setComment('')
            setReplyTo([]);
            setRefresh(!refresh);
            setLoading(false)
        } catch (err) {
            console.error(err)
            setLoading(false)
        }
    }
    function onReply(profile: string, threadID: string) {
        setReplyTo([profile, threadID]);
    }

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

    // post reaction
    async function handleReaction(e: string) {
        if (loading || !user) return;
        setLoading(true);

        // responsive ux good -> mock server changes using local/client state variables
        updateLocalReactions(e, user.email);

        // do the actual thing
        try {
            await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/${data.donutID}/${data.postOrder}/reaction`, 
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
        <div className={styles.wrapper}>
            <DonutBanner partial={data.donut} />
            <div className={styles.post}>
                {/* <div>
                    <Tag type="social" />
                </div> */}
                <Header1>
                    {data.title}
                </Header1>
                <P style={{whiteSpace: 'pre-line'}}>
                    {data.description}
                </P>
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
                        <Button key={emoji} active={reactionsData[emoji].profiles.includes(user.email)} onClick={()=>handleReaction(emoji)} variant="ghost" size="small">
                            {emoji} {reactionsData[emoji].count}
                        </Button>
                    ))}
                    <Reaction onClick={(e)=>handleReaction(e)} />
                </div>
            </div>
            {threadNodes && threadNodes?.length > 0 && (
                <div key={threadNodes.length} className={styles.comments}>
                    <P small dark>
                        Comments
                    </P>
                    <Threads threadNodes={threadNodes} onReply={onReply} />
                </div>
            )}
            <div className={styles.commentField}>
                <input value={comment} onChange={e=>setComment(e.target.value)} type="text" placeholder={replyTo?.length == 2 ? `Reply to ${replyTo[0]}` : "Add a comment..."} />
                <Button size="small" variant="ghost" onClick={handleThread}>
                {replyTo?.length == 2 ? 'Reply' : 'Add'}
                </Button>
                {replyTo?.length == 2 && (
                    <Button size="small" variant="ghost" onClick={()=>setReplyTo([])}>
                        Cancel
                    </Button>
                )}
            </div>
        </div>
    )
}