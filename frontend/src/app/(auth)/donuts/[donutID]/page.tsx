"use client"

import DonutChatScreen from "@/screens/DonutChat/DonutChat"
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function DonutChat() {
  
  const { donutID } = useParams();

  const [donutData, setDonutData] = useState<any>();
  const [chat, setChat] = useState<any>();

  async function fetchDonut() {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/donut/${donutID}`, {
        withCredentials: true
      });
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/donut/${donutID}/messages`, {
        withCredentials: true
      });
      setDonutData(res.data[0]);
      setChat(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchDonut();
  }, [])
    
  return donutData && <DonutChatScreen donut={donutData} chat={chat} />
}