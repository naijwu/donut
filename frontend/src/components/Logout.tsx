"use client";

import { useAuthContext } from "@/utility/Auth";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Logout() {
    
    const router = useRouter();
  const { checkLoginState } = useAuthContext();

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logout`, {}, {
        withCredentials: true
      });

      router.push('/');
      checkLoginState();
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <button onClick={handleLogout}>
        Logout    
    </button>
  )
}