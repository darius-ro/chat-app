import { PostType } from "@/@types/posts";
import { UserType } from "@/@types/users";
import Image from "next/image";
import { getPrettierTime } from "@/utils/time";
import { getUser } from "@/utils/users";
import { useEffect, useState } from "react";
import placeholder from "@/public/placeholder.png";

export function PostComponent({
  post,
}: Readonly<{
  post: PostType;
}>) {
  const [user, setUser] = useState<UserType | undefined>();
  useEffect(() => {
    const fetchUser = async () => {
      const usr = await getUser(post.author);
      if (!usr.error) setUser(usr.user);
    };

    fetchUser();
  }, [post.author]);
  return (
    <>
      <div className="border border-neutral-800 rounded-xl p-4">
        <div className="flex gap-x-2 items-center">
          <Image
            width={35}
            height={35}
            src={user?.thumbnail || placeholder}
            alt="Profile Picture"
            className="rounded-full"
          />
          <h1>@{user?.username}</h1>
        </div>
        <div className="w-full border-b border-neutral-700 my-3"></div>
        <div>
          <p>{post.content}</p>
        </div>
        <div className="w-full border-b border-neutral-700 my-3"></div>
        <div>
          <div>
            <span className="text-md text-neutral-600">
              Posted {getPrettierTime(post.createdAt ?? "0")}
            </span>
          </div>
          <div>{/* Add likes/reactions, replies, or other */}</div>
        </div>
      </div>
    </>
  );
}
