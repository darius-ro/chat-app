export type PostType = {
  _id: string;
  author: string;
  content?: string | null;
  image?: string | null;
  views?: number;
  createdAt?: string;
  updatedAt?: string;
};

export type PostsResponse = {
  error: string | boolean;
  posts?: PostType[] | null;
};

export type CreatePostResponse = {
  error: string | boolean;
  post?: PostType;
};
