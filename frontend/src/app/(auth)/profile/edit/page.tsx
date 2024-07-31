"use client"

import EditProfileScreen from "@/screens/EditProfile/EditProfileScreen"
import { useAuthContext } from "@/utility/Auth";
import axios from "axios";
import { useEffect, useState } from "react";

export default function EditProfile() {
  const { user } = useAuthContext();

  const [profileData, setProfileData] = useState<any>();
  const [hobbiesData, setHobbiesData] = useState<any[]>();

  async function fetchData() {
    try {
      // TODO: Refactor so only 1 call to server, 1 oracledb connection, 3 queries in server
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/hobbies`, {
        withCredentials: true
      });
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/profile/${user.email}`, {
        withCredentials: true
      });
      setHobbiesData(data);
      setProfileData(res.data)
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (user) {
        fetchData();
    }
  }, [user])
    
  return profileData && <EditProfileScreen profile={profileData.profile[0]} profileHobbies={profileData.hobbies} hobbies={hobbiesData} />
}