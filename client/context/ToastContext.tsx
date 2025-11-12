"use client";
import { ToastContextType } from "@/@types/toast";
import React, { createContext, useContext, useState, useEffect } from "react";

const ToastContext = createContext<ToastContextType>({
  ShowSuccess: null,
  ShowError: null,
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({
  children,
}: Readonly<{ children: React.ReactNode }>) => {
  const showError = (content: string, time: number) => {};

  const showSuccess = (content: string, time: number) => {};

  return (
    <>
      <ToastContext.Provider
        value={{ ShowSuccess: showSuccess, ShowError: showError }}
      >
        {/* to be finished */}
        <div className="bottom-6 right-6 bg-red-500 p-2 rounded-lg z-100 fixed w-64 hidden">
          <div className="flex align-middle text-left">
            <div className="flex-1 mt-1">
              <h1 className="font-semibold">Something went wrong..</h1>
            </div>
            <button className="cursor-pointer rounded-full h-8 w-8">X</button>
          </div>
        </div>
        {children}
      </ToastContext.Provider>
    </>
  );
};
