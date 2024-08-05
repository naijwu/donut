"use client"

import EditPost from "@/screens/EditPost/EditPost";
import { useAuthContext } from "@/utility/Auth";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditDonutPost() {
  
  const { user } = useAuthContext();
  const { donutID } = useParams();

  const [postData, setPostData] = useState<any>();
  const [donutData, setDonutData] = useState<any>();
  const [imagesData, setImagesData] = useState<any>();

  async function fetchData() {
    try {
      const donutRes = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/donut/${donutID}`, {
        withCredentials: true
      });
      const postRes = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/donut/${donutID}/profile/${user.email}`, {
        withCredentials: true
      });
      console.log(postRes)
      let imagesRes = { data: [] };
      if (postRes.data[0]) {
        imagesRes = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/post/donut/${donutID}/order/${postRes.data[0][2]}/pictures`, {
            withCredentials: true
        });
      }

      setDonutData(donutRes.data[0]);
      setPostData(postRes.data[0] || []);
      setImagesData(imagesRes.data || []);
    //   console.log(donutRes, postRes)
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (user) {
        fetchData();
    }
  }, [user])
    
  return (donutData && imagesData && postData) && <EditPost donut={donutData} post={postData} pictures={imagesData} />
}