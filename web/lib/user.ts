import { UpdateUserData } from "@/types/user";
import api from "./api";

export const updateUser = async (data: UpdateUserData) => {
  const { data: response } = await api.patch("/users/me", data);
  return response;
};
