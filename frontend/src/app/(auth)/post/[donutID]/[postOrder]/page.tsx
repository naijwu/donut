"use client"

import Post from "@/screens/Post/Post";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PostPage() {
  
    const { donutID, postOrder } = useParams();
    const [postData, setPostData] = useState<any>();
  
    async function fetchData() {
      try {
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/donut/${donutID}/order/${postOrder}`, {
          withCredentials: true
        });  
        setPostData(data);
      } catch (err) {
        console.error(err);
      }
    }
  
    useEffect(() => {
        fetchData();
    }, [])

    return postData && <Post data={postData} />
}