import { z } from "zod";

// Projects
export const projectSchema = z.object({
  _id: z.string(),
  projectName: z
    .string()
    .min(3, "El nombre del proyecto debe tener al menos 3 caracteres"),
  clientName: z
    .string()
    .min(3, "El nombre del cliente debe tener al menos 3 caracteres"),
  description: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres"),
});

//export const dashboardProjectsSchema = z.array(projectSchema);

export const dashboardProjectsSchema = z.array(
  projectSchema.pick({
    _id: true,
    projectName: true,
    clientName: true,
    description: true,

  })
);
 

export type Project = z.infer<typeof projectSchema>;
export type ProjectFormData = Pick<Project, "projectName" | "clientName" | "description">;