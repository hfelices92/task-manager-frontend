import { z } from "zod";

// ----------- Tasks ----------------
export const taskStatusSchema = z.enum([
  "pending",
  "onHold",
  "inProgress",
  "underReview",
  "completed",
]);
export const taskSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  project: z.string(),
  status: taskStatusSchema.default("pending"),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const taskProjectSchema = taskSchema.pick({
  _id: true,
  name: true,
  description: true,
  status: true,
});

export type Task = z.infer<typeof taskSchema>;
export type TaskFormData = Pick<Task, "name" | "description">;
export type TaskProject = z.infer<typeof taskProjectSchema>;
export type TaskStatus = z.infer<typeof taskStatusSchema>;
// ----------- Projects ----------------
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
  tasks: z.array(taskSchema),
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
export type ProjectFormData = Pick<
  Project,
  "projectName" | "clientName" | "description"
>;
