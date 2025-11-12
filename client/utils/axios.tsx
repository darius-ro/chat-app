"use client";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
const LOCALSTORAGE_AUTH_NAME =
  process.env.NEXT_PUBLIC_AUTH_LOCALSTORAGE_NAME ?? "_auth";

import Axios from "axios";
export default function CreateAxios() {
  const auth = localStorage.getItem(LOCALSTORAGE_AUTH_NAME);
  const headers: Record<string, string> = {};
  if (auth) headers["Authorization"] = "Bearer " + auth;
  return Axios.create({
    baseURL: BASE_URL,
    headers,
    validateStatus: () => true,
  });
}
