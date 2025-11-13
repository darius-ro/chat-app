import { GetUserResponse, UserType } from "@/@types/users";
import Axios from "./axios";
import { UserValidation } from "@/validations/users";
const users: Record<string, UserType> = {}; // probably not recommended for production

export async function getUser(_id: string): Promise<GetUserResponse> {
  if (users[_id])
    return {
      error: false,
      user: users[_id],
    };
  try {
    const axios = Axios();
    const response = await axios.get(`/users/${_id}`);
    const data = response.data;

    if (data?.error === false) {
      const { error, value } = UserValidation.validate(data.user);
      if (error)
        return {
          error: error.message,
        };
      else users[value._id] = value;
      return {
        error: false,
        user: value,
      };
    } else
      return {
        error: data.error || "Missing error in body.",
      };
  } catch (error) {
    return {
      error: "An unexpected error has occured.",
    };
  }
}
