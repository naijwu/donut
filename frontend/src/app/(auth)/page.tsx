"use client"

import { useAuthContext } from "@/utility/Auth"

export default function App() {
    
    const { user } = useAuthContext();

  return (
    <div>
        Welcome to UBC Donuts, {user?.name}
    </div>
  )
}