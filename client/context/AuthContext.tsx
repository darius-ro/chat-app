"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

import { AuthContextType, UserType } from "@/@types/auth";
import CreateAxios from "@/utils/axios";
const LOCALSTORAGE_AUTH_NAME =
  process.env.NEXT_PUBLIC_AUTH_LOCALSTORAGE_NAME ?? "_auth";

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  CheckUserAuth: null,
  SetAuthToken: null,
  DeleteAuthToken: null,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  const CheckUserAuth = async () => {
    try {
      const axios = CreateAxios();
      const request = await axios.get("/auth/");

      if (request.status == 200)
        setUser({
          _id: request.data._id || null,
          username: request.data.username || null,
          logged: true,
        });
      else
        setUser({
          logged: false,
          _id: null,
          username: null,
        });
    } catch (err) {
      console.log(err); // Whoops
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const SetAuthToken = async (token: string) => {
    localStorage.setItem(LOCALSTORAGE_AUTH_NAME, token);
  };

  const DeleteAuthToken = async (token: string) => {
    localStorage.removeItem(LOCALSTORAGE_AUTH_NAME);
    CheckUserAuth();
  };

  useEffect(() => {
    CheckUserAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, CheckUserAuth, SetAuthToken, DeleteAuthToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};
