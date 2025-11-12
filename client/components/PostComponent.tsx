import { PostType } from "@/@types/posts";
import { getPrettierTime } from "@/utils/time";

export function PostComponent({
  post,
}: Readonly<{
  post: PostType;
}>) {
  return (
    <>
      <div className="border border-neutral-800 rounded-xl p-4">
        <div>
          <h1>{post.author}</h1>
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
