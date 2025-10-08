import api from "../lib/axios";
import { isAxiosError } from "axios";
import type { ChangePasswordForm, UserProfileForm } from "../types";



export async function updateProfile(formData: UserProfileForm) {
  try {
    const url = "/auth/profile";
    const { data } = await api.put<string>(url, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function changePassword(formData: ChangePasswordForm) {
  try {
    const url = "/auth/change-password";
    const formatedData = {
      currentPassword: formData.currentPassword,
      newPassword: formData.password,
      newPasswordConfirmation: formData.passwordConfirmation
    }
    const { data } = await api.post<string>(url, formatedData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}