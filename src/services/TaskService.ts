import api from "../lib/axios";
import { isAxiosError } from "axios";
import {
  taskSchema,
  type Project,
  type Task,
  type TaskFormData,
} from "../types";

type TaskApi = {
  formData: TaskFormData;
  projectId: Project["_id"];
  taskId: Task["_id"];
  status: Task["status"];
};

export async function createTask({
  projectId,
  formData,
}: Pick<TaskApi, "formData" | "projectId">) {
  try {
    const { data } = await api.post<string>(
      `/projects/${projectId}/tasks`,
      formData
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getTaskById({
  projectId,
  taskId,
}: Pick<TaskApi, "projectId" | "taskId">) {
  try {
    const { data } = await api.get(`/projects/${projectId}/tasks/${taskId}`);
    const response = taskSchema.safeParse(data);
    if (response.success) {
      return response.data;
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function updateTask({
  projectId,
  taskId,
  formData,
}: Pick<TaskApi, "projectId" | "taskId" | "formData">) {
  try {
    const { data } = await api.put<string>(
      `/projects/${projectId}/tasks/${taskId}`,
      formData
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function deleteTask({
  projectId,
  taskId,
}: Pick<TaskApi, "projectId" | "taskId">) {
  try {
    const { data } = await api.delete<string>(
      `/projects/${projectId}/tasks/${taskId}`
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function updateTaskStatus({
  projectId,
  taskId,
  status,
}: Pick<TaskApi, "projectId" | "taskId" | "status">) {
  try {
    const { data } = await api.post<string>(
      `/projects/${projectId}/tasks/${taskId}/status`,
      { status }
    );
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error("An unexpected error occurred");
  }
}
