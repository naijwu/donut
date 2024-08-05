"use client";

import Navbar from "@/components/Navbar/Navbar";
import { useAuthContext } from "@/utility/Auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) =>
        console.log(
          "sw.js registered with: ",
          registration.scope,
        ),
      )
      .catch((err) => console.log("sw.js registration fail: ", err));
  }, []);

  const { loading, loggedIn } = useAuthContext();

  const router = useRouter();

  if (!loading && !loggedIn) {
    router.push('/auth')
  }

  return (
    <>
      <div style={{
        padding: '1.1rem 1.1rem calc(1.1rem + 76px) 1.1rem',
        height: '100%'
      }}>
        {children}
      </div>
      {loggedIn && <Navbar />} 
    </>
  )
}