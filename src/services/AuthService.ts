import api from "../lib/axios";
import { isAxiosError } from "axios";
import type {
  ForgotPasswordForm,
  RequestConfirmationCodeForm,
  UserConfirmAccountToken,
  UserLoginForm,
  UserRegistrationForm,
  NewPasswordForm,
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
    console.log(error);

    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export const login = async (formData: UserLoginForm) => {
  console.log(formData);

  try {
    const url = "/auth/login";
    const { data } = await api.post(url, formData);
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
  console.log(formData, token);
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
