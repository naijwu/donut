"use client"

import { useEffect, useState } from "react";
// import { DEMO_NOTIF } from "@/lib/demo"
import { useAuthContext } from "@/utility/Auth";
import axios from "axios";
import NotificationsScreen from "@/screens/Notifications/NotificationsScreen"

export default function Notifications() {
   
  const [notifData, setNotifData] = useState<any>();
  const { user } = useAuthContext();

  async function fetchData() {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/notifications/${user.email}`, {
        withCredentials: true
      });  
      setNotifData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user])

  return notifData && <NotificationsScreen notifications={notifData} />
}