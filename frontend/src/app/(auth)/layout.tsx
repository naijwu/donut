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

  const { loggedIn } = useAuthContext();

  return (
    <>
      {children}
      {loggedIn && <Navbar />} 
    </>
  )
}