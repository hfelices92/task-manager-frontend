import api from "../lib/axios";
import {
  dashboardProjectsSchema,
  projectSchema,
  type Project,
  type ProjectFormData,
} from "../types";
import { isAxiosError } from "axios";

export async function createProject(formData: ProjectFormData) {
  try {
    const { data } = await api.post("/projects", formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getProjects() {
  try {
    const { data } = await api.get("/projects");
    const response = dashboardProjectsSchema.safeParse(data);

    if (response.success) {
      return response.data;
    } else {
      console.error(response.error);
      throw new Error("Invalid data format");
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function getProjectByID(id: Project["_id"]) {
  try {
    const { data } = await api.get(`/projects/${id}`);
    const response = projectSchema.safeParse(data);

    if (response.success) {
      return response.data;
    } else {
      console.error(response.error);
      throw new Error("Invalid data format");
    }
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error("An unexpected error occurred");
  }
}

export async function updateProjectByID({
  id,
  formData,
}: {
  id: Project["_id"];
  formData: ProjectFormData;
}) {
  try {
    const { data } = await api.put<String>(`/projects/${id}`, formData);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
    throw new Error("An unexpected error occurred");
  }
}
