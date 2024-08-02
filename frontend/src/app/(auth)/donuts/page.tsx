"use client"

import DonutsScreen from "@/screens/Donuts/DonutsScreen"
import { useAuthContext } from "@/utility/Auth";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Donuts() {

  const { user } = useAuthContext();

  const [donutData, setDonutData] = useState<any>();

  async function fetchDonuts() {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/donut/profile/${user.email}`, {
        withCredentials: true
      });
      setDonutData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (user) {
      fetchDonuts();
    }
  }, [user])
    
  return donutData && <DonutsScreen donuts={donutData} />
}