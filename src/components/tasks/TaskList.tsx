import { statusTranslations } from "../../locales/es";
import type { Project, TaskProject, TaskStatus } from "../../types";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import DropTask from "./DropTask";
import TaskCard from "./TaskCard";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTaskStatus } from "../../services/TaskService";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

type TaskListProps = {
  tasks: TaskProject[];
  canEdit: boolean;
};

type GroupedTasks = {
  [key: string]: TaskProject[];
};

const initialStatusGroups: GroupedTasks = {
  pending: [],
  onHold: [],
  inProgress: [],
  underReview: [],
  completed: [],
};

const statusStyles: { [key: string]: string } = {
  pending: "border-t-amber-500",
  onHold: "border-t-red-500",
  inProgress: "border-t-blue-500",
  underReview: "border-t-purple-500",
  completed: "border-t-green-500",
};
export default function TaskList({ tasks, canEdit }: TaskListProps) {
  const groupedTasks = tasks.reduce((acc, task) => {
    let currentGroup = acc[task.status] ? [...acc[task.status]] : [];
    currentGroup = [...currentGroup, task];
    return { ...acc, [task.status]: currentGroup };
  }, initialStatusGroups);
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateTaskStatus,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Estado de la tarea actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
  });
  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;
    if (over && over.id) {
      const taskId = active.id.toString();

      const status = over.id as TaskStatus;

      mutate({ taskId, status, projectId });
      queryClient.setQueryData(["project", projectId], (oldData: Project) => {
        const updatedTasks = oldData.tasks.map((task) => {
          if (task._id === taskId) {
            return { ...task, status };
          }
          return task;
        });
        return { ...oldData, tasks: updatedTasks };
      });
    }
  };

  return (
    <>
      <h2 className="text-5xl font-black my-10">Tareas</h2>

      <div className="flex gap-5 overflow-x-scroll 2xl:overflow-auto pb-32">
        <DndContext onDragEnd={handleDragEnd}>
          {Object.entries(groupedTasks).map(([status, tasks]) => (
            <div key={status} className="min-w-[300px] 2xl:min-w-0 2xl:w-1/5">
              <h3
                className={`text-2xl font-light text-center mb-5 capitalize
             first-letter:text-amber-500 first-letter:font-bold
              bg-white p-3 rounded-lg border border-slate-300 border-t-8 shadow-md ${statusStyles[status]}`}
              >
                {statusTranslations[status]}
              </h3>
              <DropTask status={status} />
              <ul className="mt-5 space-y-5">
                {tasks.length === 0 ? (
                  <li className="text-gray-500 text-center pt-3">
                    No Hay tareas
                  </li>
                ) : (
                  tasks.map((task) => (
                    <TaskCard key={task._id} task={task} canEdit={canEdit} />
                  ))
                )}
              </ul>
            </div>
          ))}
        </DndContext>
      </div>
    </>
  );
}
