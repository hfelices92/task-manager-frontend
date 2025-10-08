import api from "../lib/axios";
import { isAxiosError } from "axios";
import {
  type ForgotPasswordForm,
  type RequestConfirmationCodeForm,
  type UserConfirmAccountToken,
  type UserLoginForm,
  type UserRegistrationForm,
  type NewPasswordForm,
  userSchema,
  type CheckPasswordForm,
} from "../types";

export async function createAcount(formData: UserRegistrationForm) {
  try {
    const url = "/auth/create-account";
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function confirmAccount(token: UserConfirmAccountToken) {
  try {
    const url = "/auth/confirm-account";
    const { data } = await api.post<string>(url, token);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function requestConfrimationCode(
  email: RequestConfirmationCodeForm
) {
  try {
    const url = "/auth/request-confirmation-code";
    const { data } = await api.post<string>(url, email);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export const login = async (formData: UserLoginForm) => {
  try {
    const url = "/auth/login";
    const { data } = await api.post(url, formData);

    localStorage.setItem("TM_AUTH_TOKEN", data);

    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

export const forgotPassword = async (email: ForgotPasswordForm) => {
  try {
    const url = "/auth/forgot-password";
    const { data } = await api.post(url, email);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

export const checkToken = async (token: UserConfirmAccountToken) => {
  try {
    const url = "/auth/check-token";
    const { data } = await api.post<string>(url, token);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

export const newPassword = async ({
  formData,
  token,
}: {
  formData: NewPasswordForm;
  token: UserConfirmAccountToken["token"];
}) => {
  try {
    const url = `/auth/reset-password/${token}`;
    const { data } = await api.post<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

export const getUser = async () => {
  try {
    const { data } = await api.get("/auth/user");
    const response = userSchema.safeParse(data);

    if (response.success) {
      return response.data;
    } else {
      throw new Error("Error al obtener los datos del usuario");
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};

export const checkPassword = async (formData: CheckPasswordForm) => {
  
  try {
    const url = "/auth/check-password";
    const { data } = await api.post(url, { password: formData.password });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
};
