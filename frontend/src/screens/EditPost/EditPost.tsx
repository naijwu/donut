"use client"

import DonutBanner from '@/components/DonutBanner/DonutBanner';
import { List_DonutCols } from '@/lib/maps';
import { useEffect, useRef, useState } from 'react'
import styles from './EditPost.module.css'
import ContentEditable from "react-contenteditable"
import Button from '@/components/Button/Button';
import { useRouter } from 'next/navigation';

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

export default function EditPost({
    donut,
    post
}: {
    donut: any[],
    post: any[]
}) {

    const router = useRouter();

    const [title, setTitle] = useState<string>();
    const [description, setDescription] = useState<string>();
    const [images, setImages] = useState<any>();

    async function handleAddImage(args: any) {
        const updatedImages = JSON.parse(JSON.stringify(images));
        
        // MIME checking isn't robust
        //      TODO: need to read header data via buffer, but also change that on server-side too
        //      or, convert any other images on our end via some api (i.e. cloudconvert) or JS client-side
        const mt = args.event.target.files[0]?.type;
        if (!mtmap[mt]) {
            console.log('Unsupported type')
            return
        }

        let validSize = false

        const fileBytes = args.event.target.files[0]?.size
        const maxMB = 2;
        if (fileBytes < (maxMB * 1000 * 1000)) {
            validSize = true
        }

        if (!validSize) {
            console.log('File too big damn')
            return
        }

        updatedImages.push({
            name: args.event.target.files[0].name,
            url: URL.createObjectURL(args.event.target.files[0])
        })
        setImages(updatedImages)
    }
    async function handleRemoveImage(index: string) {
        const updatedImages = JSON.parse(JSON.stringify(images));
        updatedImages.splice(index, 1)
        setImages(updatedImages);
    }

    async function handleSave() {

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
                    <Button size="medium" variant="solid" onClick={()=>router.push(`donuts/${donut[List_DonutCols.donutID]}`)}>
                        Return
                    </Button>
                    <Button size="medium" variant="solid" onClick={handleSave}>
                        Save post
                    </Button>
                </div>
            </div>
            
            <div className={styles.editing}>
                <EditableTitle value={title} onChange={setTitle} placeholder="Your title here" />
                <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Tell us what you did!"></textarea>
            </div>
            <div className={styles.images}>
                <input type="file" id="image" name="image" accept="image/png, image/jpeg" onChange={e=>handleAddImage(e.target)} />
            </div>
        </div>
    )
}