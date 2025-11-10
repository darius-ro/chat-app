import Axios from "./axios";

export function createPost(content?: string, image?: string) {
  return new Promise(async (res, rej) => {
    const axios = Axios();

    const formData = new FormData();
    formData.set("content", content ?? "");
    formData.set("image", image ?? ""); // We will handle images later...

    try {
      const request = await axios.post("/posts/", formData, {
        validateStatus: () => true,
      });
      const data = request.data;
      if (data?.error && data.error !== false) {
        return res({
          error: data.error,
        });
      } else if (data?._id) {
        return res({
          error: false,
          _id: data._id,
        });
      }
    } catch (err) {
      rej(err);
    }
  });
}
