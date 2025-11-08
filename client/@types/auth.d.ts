export type UserType = {
    _id: String | null;
    username: String | null;
    logged: Boolean | null;
}

export type AuthContextType = {
    loading: Boolean;
    user: UserType | null;
    CheckUserAuth: function | null;
    SetAuthToken: function | null;
    DeleteAuthToken: function | null;
}

export type LoginRequestType = {
    error: Boolean | null;
    _id: String | null;
}