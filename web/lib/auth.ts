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

export const apiVerifyEmail = async (token: string) => {
  const { data } = await api.get(`/auth/verify-email?token=${token}`);
  return data;
};

export const apiForgotPassword = async (email: string) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const apiResetPassword = async (token: string, password: string) => {
  const { data } = await api.post("/auth/reset-password", { token, password });
  return data;
};
