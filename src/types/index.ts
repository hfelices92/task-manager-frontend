import { z } from "zod";

// -----------Auth & Users ----------------

const authSchema = z.object({
  name: z.string(),
  email: z.email(),
  currentPassword: z.string(),
  password: z.string(),
  passwordConfirmation: z.string(),
  token: z.string(),
});

type Auth = z.infer<typeof authSchema>;
export type UserLoginForm = Pick<Auth, "email" | "password">;
export type UserRegistrationForm = Pick<
  Auth,
  "email" | "password" | "name" | "passwordConfirmation"
>;
export type RequestConfirmationCodeForm = Pick<Auth, "email">;
export type UserConfirmAccountToken = Pick<Auth, "token">;
export type ForgotPasswordForm = Pick<Auth, "email">;
export type NewPasswordForm = Pick<Auth, "password" | "passwordConfirmation">;
export type ChangePasswordForm = Pick<
  Auth,
  "currentPassword" | "password" | "passwordConfirmation"
>;
export type CheckPasswordForm = Pick<Auth, "password">;

//User

export const userSchema = authSchema
  .pick({
    name: true,
    email: true,
  })
  .extend({
    _id: z.string(),
  });

export type User = z.infer<typeof userSchema>;
export type UserProfileForm = Pick<User, "name" | "email">;

//------------ Notes ----------------
export const noteSchema = z.object({
  _id: z.string(),
  content: z.string(),
  task: z.string(),
  createdBy: userSchema,
  createdAt: z.string(),
});

export type Note = z.infer<typeof noteSchema>;
export type NoteFormData = Pick<Note, "content">;
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
  completedBy: z
    .array(
      z.object({
        user: userSchema,
        status: taskStatusSchema,
        date: z.string(),
      })
    )
    .default([]),
  notes: z
    .array(
      noteSchema.extend({
        createdBy: userSchema,
      })
    )
    .default([]),
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
  projectName: z.string(),
  clientName: z.string(),
  description: z.string(),
  tasks: z.array(taskProjectSchema),
  manager: z.string(),
});

export const dashboardProjectsSchema = z.array(
  projectSchema.pick({
    _id: true,
    projectName: true,
    clientName: true,
    description: true,
    manager: true,
  })
);

export const editProjectSchema = projectSchema.pick({
  projectName: true,
  clientName: true,
  description: true,
});
export type Project = z.infer<typeof projectSchema>;
export type ProjectFormData = Pick<
  Project,
  "projectName" | "clientName" | "description"
>;

// ----------- Team Members ----------------
export const teamMemberSchema = userSchema.pick({
  _id: true,
  name: true,
  email: true,
});

export const teamMembersSchema = z.array(teamMemberSchema);
export type TeamMember = z.infer<typeof teamMemberSchema>;
export type TeamMemberForm = Pick<TeamMember, "email">;
export type TeamMembers = z.infer<typeof teamMembersSchema>;
