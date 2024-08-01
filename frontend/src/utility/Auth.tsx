"use client";

import { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from 'axios'

export function useAuthContext() {
  return useContext(AuthContext) as { loading: boolean, loggedIn: any, checkLoginState: any, user: any, channels: any };
}

export const AuthContext: any = createContext(null);

export const AuthProvider = ({ children }: any) => {
    const [loading, setLoading] = useState<boolean>(true);
  const [loggedIn, setLoggedIn] = useState(null);
  const [user, setUser] = useState(null);

  const checkLoginState = useCallback(async () => {
    console.log('checkLoginState()')
    try {
        setLoading(true);
      const { data: { loggedIn: logged_in, user }} = await axios.get(`${process.env.NEXT_PUBLIC_SERVER_URL}/auth/logged_in`, {
        withCredentials: true
      });

      setLoggedIn(logged_in);
      user && setUser(user);
      // console.log(user);

      if (!logged_in) {
        setUser(null);
      } else {
        console.log('Valid user token');
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkLoginState();
  }, [checkLoginState]);

  return (
    <AuthContext.Provider value={{ 
        loggedIn, 
        checkLoginState, 
        user,
        loading
    }}>
      {children}
    </AuthContext.Provider>
  );
}