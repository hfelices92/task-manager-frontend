import api from "../lib/axios";
import { isAxiosError } from "axios";
import { teamMemberSchema, teamMembersSchema, type Project, type TeamMember, type TeamMemberForm } from "../types";


export async function findUserByEmail(data: {projectId: Project['_id'], formData: TeamMemberForm}) {
    const { projectId, formData } = data; 
  try {
    const url = `/projects/${projectId}/team/find`;
    const { data } = await api.post(url, formData);
    const response = teamMemberSchema.safeParse(data);
    if (!response.success) {
      throw new Error("Error al parsear los datos del usuario");
    }
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function addMemberToProject({projectId, memberId}: {projectId: Project['_id'], memberId: TeamMember['_id']}) {
    
  try {
    const url = `/projects/${projectId}/team`;
    const { data } = await api.post<string>(url, {  memberId });
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function getProjectTeam(projectId: Project['_id']) {
  try {
    const url = `/projects/${projectId}/team`;
    const { data } = await api.get(url);
    const response = teamMembersSchema.safeParse(data);
    if (!response.success) {
      throw new Error("Error al parsear los datos del equipo");
    }
    return response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}

export async function removeMemberFromProject({projectId, memberId}: {projectId: Project['_id'], memberId: TeamMember['_id']}) {
  try {
    const url = `/projects/${projectId}/team/${memberId}`;
    const { data } = await api.delete<string>(url);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(error.response.data.error);
    }
  }
}