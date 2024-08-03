// from https://stackoverflow.com/questions/32553158/detect-click-outside-react-component

import React, {
    useRef, useEffect
} from "react";

type Props = {
    allowedRef?: any,
    disallowedRef?: any,
    onClickOutside?: () => void,
    children?: any
}

/**
 * Hook that alerts clicks outside of the passed ref
 *
 * TODO: converted `allowedRef` into accepting array of refs instead of a single
 */
function useOutsideAlerter(ref: any, allowedRef: any, disallowedRef: any, triggerFunction: any) {
    useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
        function handleClickOutside(event: any) {
            if (allowedRef && allowedRef.current && disallowedRef && disallowedRef.current ?
                ref.current && (!ref.current.contains(event.target) || disallowedRef.current.contains(event.target))
                : allowedRef && allowedRef.current ?
                    ref.current && (!ref.current.contains(event.target) && !allowedRef.current.contains(event.target))
                    : ref.current && !ref.current.contains(event.target)) {
                triggerFunction()
            }
        }
        // Bind the event listener
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            // Unbind the event listener on clean up
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, triggerFunction]);
}

/**
 *
 * @param props allowedRef: does not get triggered, disallowedRef: specifically gets triggered, onClickOutside: runs
 * @returns void
 */
export default function OutsideAlerter(props: Props) {
    const wrapperRef = useRef(null);
    useOutsideAlerter(wrapperRef, props.allowedRef, props.disallowedRef, props.onClickOutside);

    return <div ref={wrapperRef}>{props.children}</div>;
}