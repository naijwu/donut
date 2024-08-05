"use client"

// import { DEMO_NOTIF } from "@/lib/demo"
import axios from "axios";

export default function handleAddNotification(email: string, message: string) {
    async function insertNotif(email: string, message: string) {
        try {
            const res = await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/notifications/${email}/${message}`, {}, {
                withCredentials: true
            });
        } catch (err) {
            console.error("Failed to add notification:", err);
        }
    }

    insertNotif(email, message);
  }