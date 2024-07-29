"use client"

import { useAuthContext } from "@/utility/Auth";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function Callback() {
    const called = useRef(false);
    const { checkLoginState, loggedIn } = useAuthContext();

    const router = useRouter();

    async function handleCb() {
        if (loggedIn === false) {
            try {
                console.log('hi')
                if (called.current) return;
                called.current = true;
                const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/token${window.location.search}`, {
                    withCredentials: true
                });
                console.log('response: ', res);
                checkLoginState();
                router.push('/');
            } catch (err) {
                console.error(err);
                router.push('/');
            }
        } else if (loggedIn === true) {
            router.push('/');
        }
    }

    useEffect(() => {
        handleCb();
    }, [ checkLoginState, loggedIn, router ])

    return <></>
}