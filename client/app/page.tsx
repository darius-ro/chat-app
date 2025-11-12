"use client";

import { useAuth } from "@/context/AuthContext";
import InputBoxComponent from "../components/InputBoxComponent";
import { createPost, getPosts } from "@/utils/post";
import { useEffect, useState } from "react";
import { PostType } from "@/@types/posts";
import { PostComponent } from "@/components/PostComponent";

export default function Home() {
  const auth = useAuth();
  const [activePosts, setActivePosts] = useState<PostType[]>([]);

  const submitEventFunction = async (text: string) => {
    try {
      const post = await createPost(text);
      if (!post.error) {
        const newPost = post.post as PostType;
        setActivePosts((posts) => [newPost, ...posts]); // need to fix this
        return true;
      } else {
        // some error handling
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const attachEventFunction = () => {};

  useEffect(() => {
    const getNewPosts = async () => {
      const results = await getPosts();
      if (results.posts) {
        setActivePosts(results.posts);
      }
    };

    getNewPosts();
  }, []);

  return (
    <>
      <div className="align-middle justify-center min-h-screen min-w-screen">
        <div className="max-w-2xl m-auto">
          {/* <h1 className="text-xl font-medium my-2">Home Page</h1> */}
          <InputBoxComponent
            placeholder={
              auth.loading == true || auth.user?.logged == false
                ? "You need to login to post!"
                : undefined
            }
            disabled={auth.loading == true || auth.user?.logged == false}
            onAttachEvent={attachEventFunction}
            onSubmitEvent={submitEventFunction}
          />
          <div id="posts" className="mt-2 flex flex-col gap-y-2">
            {activePosts.map((post, i) => (
              <PostComponent key={i} post={post} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
