"use client";

import { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from 'axios'

export function useAuthContext() {
  return useContext(AuthContext) as { loggedIn: any, checkLoginState: any, user: any, channels: any };
}

export const AuthContext: any = createContext(null);

export const AuthProvider = ({ children }: any) => {
  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  const checkLoginState = useCallback(async () => {
    console.log('checkLoginState()')
    try {
      const { data: { loggedIn: logged_in, user }} = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logged_in`, {
        withCredentials: true
      });

      setLoggedIn(logged_in);
      user && setUser(user);

      if (!logged_in) {
        setUser(null);
      } else {
        console.log('Valid user token');
      }
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    checkLoginState();
  }, [checkLoginState]);

  return (
    <AuthContext.Provider value={{ 
        loggedIn, 
        checkLoginState, 
        user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}