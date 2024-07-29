"use client"

import { useState } from "react"

function useSwipe() {
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)

    // the required distance between touchStart and touchEnd to be detected as a swipe
    const minSwipeDistance = 50 

    const onTouchStart = (e: any) => {
        setTouchEnd(null) // otherwise the swipe is fired even with usual touch events
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientX)

    const onTouchEnd = (leftFn: any, rightFn: any) => {
        if (!touchStart || !touchEnd) return
        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance
        if (isLeftSwipe || isRightSwipe) {
            if (isLeftSwipe) {
                leftFn();
            } else {
                rightFn();
            }
        }
    }

    return {
        onTouchStart,
        onTouchEnd,
        onTouchMove
    }
}

type SwipeAlerterT = {
    children: any;
    onSwipeLeft: () => void;
    onSwipeRight: () => void;
}

export default function SwipeAlerter({
    children,
    onSwipeLeft,
    onSwipeRight
}: SwipeAlerterT) {
    const { onTouchStart, onTouchEnd, onTouchMove } = useSwipe();

    return (
        <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={()=>onTouchEnd(onSwipeLeft, onSwipeRight)}>
            {children}
        </div>
    )
}