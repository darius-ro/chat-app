export type UserType = {
  _id: string;
  username: string;
  thumbnail?: string;
};

export type GetUserResponse = {
  error: string | boolean;
  user?: UserType;
};
