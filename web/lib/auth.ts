import api from "./api";

export const apiRegister = async (
  name: string,
  email: string,
  password: string,
) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  return data;
};

export const apiLogin = async (email: string, password: string) => {
  const { data } = await api.post("/auth/login", { email, password });
  return data;
};

export const apiLogout = async () => {
  await api.post("/auth/logout");
};
