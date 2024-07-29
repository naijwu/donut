"use client";

import axios from 'axios'

export default function Login() {

    const handleLogin = async () => {
        try {
            const { data: { url }} = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/url`);
            
            window.location.assign(url);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <button onClick={handleLogin}>
            Sign in with Google
        </button>
    )
}