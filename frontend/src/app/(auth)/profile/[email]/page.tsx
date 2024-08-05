"use client"

import ProfileScreen from "@/screens/Profile/ProfileScreen"
import axios from "axios";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

export default function Profile() {

  const { email } = useParams();
  const [profileData, setProfileData] = useState<any>();

  async function fetchProfile() {
    const profileEmail = decodeURIComponent(email as string);
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${profileEmail}`, {
        withCredentials: true
      });   
      setProfileData(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    fetchProfile();
  }, [])
    
  return profileData && <ProfileScreen profile={profileData.profile[0]} hobbies={profileData.hobbies} />
}