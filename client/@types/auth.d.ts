export type UserType = {
  _id: string | null;
  username: string | null;
  logged: boolean | null;
};

export type AuthContextType = {
  loading: boolean;
  user: UserType | null;
  CheckUserAuth: function | null;
  SetAuthToken: function | null;
  DeleteAuthToken: function | null;
};

export type LoginRequestType = {
  error: boolean | null;
  _id: string | null;
};
