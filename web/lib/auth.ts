import api from "./api";
import Cookies from "js-cookie";

export const register = async (
  name: string,
  email: string,
  password: string,
) => {
  const { data } = await api.post("/auth/register", { name, email, password });
  Cookies.set("token", data.token, { expires: 7 });
  Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
  return data.user;
};

export const login = async (email: string, password: string) => {
  const { data } = await api.post("auth/login", { email, password });
  Cookies.set("token", data.token, { expires: 7 });
  Cookies.set("user", JSON.stringify(data.user), { expires: 7 });
  return data.user;
};

export const logout = () => {
  Cookies.remove("token");
  Cookies.remove("user")
  window.location.href = "/dashboard";
};
