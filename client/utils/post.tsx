import { CreatePostResponse, PostsResponse } from "@/@types/posts";
import Axios from "./axios";
import { ValidatePost, ValidatePosts } from "@/validations/posts";

export async function getPosts(page?: number): Promise<PostsResponse> {
  try {
    if (!page) page = 1;
    const axios = Axios();
    const posts = await axios.get(`/posts/?page=${page}`);
    const data = posts.data;
    if (data?.error === false) {
      const { error, value } = ValidatePosts.validate(data.posts);
      if (error)
        return {
          error: error.message,
        };
      else
        return {
          posts: value,
          error: false,
        };
    } else {
      return {
        error: data.error,
      };
    }
  } catch (err) {
    console.error(err);
    return { error: "Check console for info." };
  }
}

export async function createPost(
  content?: string,
  image?: string
): Promise<CreatePostResponse> {
  const axios = Axios();

  const formData = new FormData();
  formData.set("content", content ?? "");
  formData.set("image", image ?? ""); // We will handle images later...

  try {
    const request = await axios.post("/posts/", formData);
    const data = request.data;
    if (data?.error && data.error !== false) {
      return {
        error: data.error,
      };
    } else if (data?._id) {
      const { error, value } = ValidatePost.validate(data);
      if (error)
        return {
          error: error.message,
        };
      return {
        error: false,
        post: value,
      };
    } else
      return {
        error: "No _id or error was passed back.",
      };
  } catch (err) {
    console.error(err);
    return { error: "Check console for info." };
  }
}
