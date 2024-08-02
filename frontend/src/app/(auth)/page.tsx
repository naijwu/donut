"use client"

import FeedScreen from "@/screens/Feed/FeedScreen";
import axios from "axios";
import { useEffect, useState } from "react";

export default function App() {

  const [posts, setPosts] = useState<any>();

  async function fetchData() {
    try {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/post`, {
        withCredentials: true
      });
      setPosts(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return <FeedScreen donuts={posts} />
}