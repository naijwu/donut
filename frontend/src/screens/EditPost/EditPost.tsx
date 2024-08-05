"use client"

import DonutBanner from '@/components/DonutBanner/DonutBanner';
import { List_DonutCols } from '@/lib/maps';
import { useEffect, useRef, useState } from 'react'
import styles from './EditPost.module.css'
import ContentEditable from "react-contenteditable"
import Button from '@/components/Button/Button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import SwipeAlerter from '@/utility/SwipeAlerter';
import { useAuthContext } from '@/utility/Auth';
import axios from 'axios';

const mtmap: {[key: string]: string} = {
    "image/jpeg": ".jpeg",
    "image/png": ".png",
}

const ContentEditableAny: any = ContentEditable;
const EditableTitle = ({
    value = '', 
    onChange,
    placeholder
}: {
    value?: string;
    onChange: (arg0: string)=>void;
    placeholder: string;
}) => {
    const text = useRef(value)
    const [displayPlaceholder, setDisplayPlaceholder] = useState(false)
    const handleChange = (e: any) => {
        const parser = new DOMParser()
        text.current = e.target.value

        const doc = parser.parseFromString(text.current || '', 'text/html')
        onChange(doc.body.textContent || '')
    }

    useEffect(() => {
        if(text.current == '') {
            setDisplayPlaceholder(true)
        } else {
            setDisplayPlaceholder(false)
        }
    }, [text.current])

    return (
        <div className={styles.editableTitle}>
            <ContentEditableAny
                style={{
                    position: 'relative',
                    outline: 'none',
                    background: 'transparent',
                    zIndex: 1
                }}
                html={text.current}
                onChange={handleChange}
            />
            <div className={`${styles.editableTitlePlaceholder} ${displayPlaceholder ? styles.display : ''}`}>
                {placeholder}
            </div>
        </div>
    )
}

const objectifyPictureRow = (pictures: any[][]) => {
    const ret = []
    for (let i = 0; i < pictures.length; i++) {
        ret.push({
            name: pictures[i][3],
            url: pictures[i][0]
        })
    }
    return ret
}

export default function EditPost({
    donut,
    post,
    pictures
}: {
    donut: any[],
    post: any[],
    pictures: any[]
}) {
    const router = useRouter();
    
    const { user } = useAuthContext();
    
    const [title, setTitle] = useState<string>(post ? post[1] : '');
    const [description, setDescription] = useState<string>(post ? post[5] : '');
    const [images, setImages] = useState<any>(pictures?.length > 0 ? objectifyPictureRow(pictures) : []);
    const [imgsToDel, setImgsToDel] = useState<any>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(false)

    async function handleAddImage(e: any) {
        const updatedImages = JSON.parse(JSON.stringify(images || []));
        
        // MIME checking isn't robust
        //      TODO: need to read header data via buffer, but also change that on server-side too
        //      or, convert any other images on our end via some api (i.e. cloudconvert) or JS client-side
        const mt = e.target.files[0]?.type;
        if (!mtmap[mt]) {
            console.log('Unsupported type')
            return
        }

        let validSize = false

        const fileBytes = e.target.files[0]?.size
        const maxMB = 2;
        if (fileBytes < (maxMB * 1000 * 1000)) {
            validSize = true
        }

        if (!validSize) {
            console.log('The file is yo mama (too big)')
            return
        }

        updatedImages.push({
            name: e.target.files[0].name,
            url: URL.createObjectURL(e.target.files[0])
        })
        setImages(updatedImages)
    }
    async function handleRemoveImage(index: number) {
        const updatedImages = JSON.parse(JSON.stringify(images));
        if (updatedImages[index].url.includes('storage.googleapis.com')) {
            // user clicks "remove" on an image that's already been uploaded; stage to delete
            const updatedImgsToDel = JSON.parse(JSON.stringify(imgsToDel));
            updatedImgsToDel.push(updatedImages[index].url);
            setImgsToDel(updatedImgsToDel);
        }
        updatedImages.splice(index, 1)
        setImages(updatedImages);
        if (activeIndex > (updatedImages.length - 1)) {
            const newActiveIndex = activeIndex - 1;
            setActiveIndex(newActiveIndex);
        }
    }

    async function handleSave() {
        if (!title || !description || !user ) return
        if (loading) return
        setLoading(true)

        let formData = new FormData();
        for (let i = 0; i < images.length; i++) {
            if (images[i].url !== '' && !images[i].url.includes('storage.googleapis.com')) {
                let blob = await fetch(images[i].url).then(r => r.blob())
                formData.append(`files`, blob);
            }
        }
        formData.append('donutID', donut[List_DonutCols.donutID])
        formData.append('title', title);
        formData.append('description', description);
        formData.append('author', user.email)

        if (post && post[2] != null) {
            // there exists a postOrder, previously created -> update

            // there may be previously uploaded images that they want deleted
            formData.append('_imagesToDelete', JSON.stringify(imgsToDel))

            try {
                await axios.patch(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/${donut[0]}/${post[2]}`, 
                    formData,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                
                setLoading(false);
                router.push(`/donuts/${donut[0]}`)
            } catch (err) {
                console.error(err)
                setLoading(false);
            }
        } else {
            // doesn't exist a postOrder -> create
            try {
                await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/${donut[0]}`, 
                    formData,
                    {
                        withCredentials: true,
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                
                setLoading(false);
                router.push(`/donuts/${donut[0]}`)
            } catch (err) {
                console.error(err)
                setLoading(false);
            }
        }

        setLoading(false);
    }

    async function handleDelete() {
        if (loading) return
        setLoading(true);

        if (confirm("Are you sure you want to delete")) {

            try {
                await axios.delete(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/${donut[0]}/${post[2]}`,
                    {
                        withCredentials: true,
                    });
                
                setLoading(false);
                router.push(`/donuts/${donut[0]}`)
            } catch (err) {
                console.error(err)
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }

    return (
        <div className={styles.wrapper}>
            {/* TODO: Use a different UI element to show which donut this post is in -- maybe a bar at the bottom instead (carrying over consistency from previous page is misleading) */}
            <div className={styles.top}>
                <DonutBanner partial={{
                    donutID: donut[List_DonutCols.donutID],
                    createdAt: donut[List_DonutCols.createdAt],
                    isCompleted: donut[List_DonutCols.isCompleted],
                    groupName: donut[List_DonutCols.groupName],
                    members: [
                        {
                            email: donut[List_DonutCols.member1],
                            pictureURL: donut[List_DonutCols.member1picture],
                            fullName: donut[List_DonutCols.member1name],
                        },
                        {
                            email: donut[List_DonutCols.member2],
                            pictureURL: donut[List_DonutCols.member2picture],
                            fullName: donut[List_DonutCols.member2name],
                        }
                    ]
                }} />
                <div className={styles.tray}>
                    <Button size="medium" variant="solid" onClick={()=>router.push(`/donuts/${donut[List_DonutCols.donutID]}`)}>
                        Return
                    </Button>
                    <Button size="medium" variant="solid" onClick={handleSave}>
                        Save post
                    </Button>
                    <Button size="medium" variant="solid" onClick={handleDelete}>
                        Delete
                    </Button>
                </div>
            </div>
            
            <div className={styles.editing}>
                <EditableTitle value={title} onChange={setTitle} placeholder="Your title here" />
                <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Tell us what you did!"></textarea>
            </div>
            <div className={styles.images}>
                <div className={styles.gallery}>
                    <div 
                      className={styles.galleryInner} 
                      style={{
                        transition: 'all 0.2s cubic-bezier(.62,.13,.15,.97)',
                        transform: `translateX(calc(-100% * ${activeIndex}))`}
                      }>
                        <SwipeAlerter 
                          onSwipeLeft={()=>{
                            if (activeIndex == (images.length - 1)) return
                            setActiveIndex(activeIndex + 1);
                          }} onSwipeRight={() => {
                            if (activeIndex == 0) return
                            setActiveIndex(activeIndex - 1);
                          }}>
                            <div 
                              className={styles.galleryScroll} 
                              style={{
                                width: `calc(100% * ${images?.length})`,
                                display: 'grid',
                                gridTemplateColumns: `repeat(${images?.length}, 1fr)`,
                              }}>
                                {images?.map(({name, url}: {name: string; url: string;}, index: number) => (
                                    <div key={url} className={styles.image}>
                                        <div className={styles.imageContainer}>
                                            <img src={url} alt={name} />
                                        </div>
                                        <Button size="small" variant="solid" onClick={()=>handleRemoveImage(index)}>
                                            Remove image
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </SwipeAlerter>
                    </div>
                </div>

                <div className={styles.uploadBtn}>
                    <label 
                      htmlFor="upload" 
                      className={styles.addImage}>
                        + Add image
                    </label>
                    <input 
                      id="upload"
                      type="file"
                      onChange={handleAddImage} />
                </div>
            </div>
        </div>
    )
}