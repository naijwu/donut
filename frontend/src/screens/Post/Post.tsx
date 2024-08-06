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
import { useRouter } from 'next/navigation'
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
    const router = useRouter()

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

    const [threadNodes, setThreadNodes] = useState<ThreadNodeList>()
    function listToTree (threadsArray: any[]) {
        // alert("new things to push")
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
                try {
                    threadList[map[node.parent]].children?.push(node)
                } catch (err) {
                    console.error(err);
                };
            } else {
                try {
                    roots.push(node)
                } catch (err) {
                    console.error(err);
                };
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
        } catch (err: any) {
            if (err && err?.response?.data && err?.response?.data?.errorNum) {
                alert('Post no longer exists')
            }
            router.push('/')
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

    // reactions stats
    const [emojiStats, setEmojiStats] = useState<any>();
    
    async function handleEmojiStats() {
        if (loading || !user) return;
        setLoading(true);

        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/emojiStats`, {
                withCredentials: true
            })
            console.log("emojiStats retrieved")
            console.log(res.data)
            setLoading(false);
            setEmojiStats(res.data)
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    }

    const [filterNum, setFilterNum] = useState<any>(null);
    async function filterReactions() {
        try {
            if (filterNum > 0) {
                const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/threads/${data.donutID}/${data.postOrder}/${filterNum}`, {
                    withCredentials: true
                });
                // Process the response data
                console.log(res.data.data);
                listToTree(res.data.data)
            }
            else {
                location.reload();
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className={styles.wrapper}>
            <DonutBanner partial={data.donut} />
            <div className={styles.post}>
                {data?.profile?.email == user?.email && (
                    <div>
                        {/* <Tag type="social" /> */}
                        <Button onClick={()=>router.push(`/donuts/${data.donutID}/post`)} size="medium" variant="solid">
                            Edit post
                        </Button>
                    </div>
                )}
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
            <P small dark>
                Comments
            </P>
            <div style={{padding: '1rem',borderRadius: 12, backgroundColor:'var(--color-ui-10)'}}>
                <div>
                    <p>Filter for comments based off reactions</p>
                    <input
                        className={styles.reactionsInput}
                        type="number"
                        min={1}
                        placeholder="Number of Reactions"
                        id="filterReactionNum"
                        onChange={(e) => setFilterNum(e.target.value)}  // Add this line to capture the input value
                    />
                    <Button onClick={filterReactions}>Filter</Button>
                    <Button onClick={loadThreads}>Reset</Button>
                </div>

                <div className={styles.emojiStatsContainer} >
                    <P dark>Emoji Stats - average reaction count for each type of emoji across thread and posts!</P>
                    <Button size="small" variant="solid" onClick={handleEmojiStats}>Show Stats</Button>
                    <div>Average Per Emoji - {emojiStats}</div>
                </div>
            </div>

            {threadNodes && threadNodes?.length > 0 && (
                <div key={threadNodes.length} className={styles.comments}>
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