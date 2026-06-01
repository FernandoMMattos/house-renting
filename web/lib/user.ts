import api from "./api";

export interface UpdateUserData {
  name?: string;
  password?: string;
}

export const updateUser = async (data: UpdateUserData) => {
  const { data: response } = await api.patch("/user/me", data);
  return response;
};

export const getMyProperties = async () => {
  const { data } = await api.get("/properties/me");
  console.log("my properties:", data);
  return data;
};
