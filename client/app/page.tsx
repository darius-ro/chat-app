"use client";

import { useAuth } from "@/context/AuthContext";
import InputBoxComponent from "../components/InputBoxComponent";
import { createPost } from "@/utils/post";

export default function Home() {
  const auth = useAuth();

  const submitEventFunction = (text: string) => {
    createPost(text).then((res) => {
      console.log(res);
    });
  };

  const attachEventFunction = () => {};

  return (
    <>
      <div className="align-middle justify-center min-h-screen min-w-screen">
        <div className="max-w-2xl m-auto">
          <h1 className="text-xl font-medium my-2">Home Page</h1>
          <InputBoxComponent
            placeholder={
              auth.loading == true || auth.user == null
                ? "You need to login to post!"
                : undefined
            }
            disabled={auth.loading == true || auth.user == null}
            onAttachEvent={attachEventFunction}
            onSubmitEvent={submitEventFunction}
          />
        </div>
      </div>
    </>
  );
}
