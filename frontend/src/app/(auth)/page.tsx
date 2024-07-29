"use client"

import AuthScreen from "@/screens/Auth/AuthScreen";
import { useAuthContext } from "@/utility/Auth"

export default function App() {
    
    const { loggedIn, user } = useAuthContext();

    console.log(loggedIn);

  return !loggedIn 
    ? <AuthScreen /> 
    : (
        <div>
            Welcome to UBC Donuts, {user?.name}
        </div>
    )
}