import { Fragment } from "react";
import type { TaskProject } from "../../types";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask } from "../../services/TaskService";
import { toast } from "react-toastify";

type TaskCardProps = {
  task: TaskProject;
  canEdit: boolean;
};

export default function TaskCard({ task, canEdit }: TaskCardProps) {
  const navigate = useNavigate();
  const params = useParams();

  const projectId = params.projectId!;
  const statusStyles: { [key: string]: string } = {
    pending: "border-l-amber-500",
    onHold: "border-l-red-500",
    inProgress: "border-l-blue-500",
    underReview: "border-l-purple-500",
    completed: "border-l-green-500",
  };
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: deleteTask,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["project", projectId],
      });
      toast.success("Tarea eliminada correctamente");
    },
  });

  return (
    <li
      className={`p-5 bg-white border border-slate-300 flex justify-between 
        gap-3 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 
        ${
          statusStyles[task.status]
        } hover:transition-transform hover:scale-[1.01]`}
    >
      <div className="min-w-0 flex flex-col gap-y-4">
        <button
          type="button"
          className="text-xl font-bold text-left text-slate-600 hover:underline cursor-pointer"
          onClick={() =>
            navigate(`${location.pathname}?viewTaskId=${task._id}`)
          }
        >
          {task.name}
        </button>
        <p className="text-slate-500">{task.description}</p>
      </div>
      <div className="flex shrink-0  gap-x-6 ">
        <Menu as="div" className="relative flex-none cursor-pointer">
          <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900 cursor-pointer">
            <span className="sr-only">opciones</span>
            <EllipsisVerticalIcon className="h-9 w-9" aria-hidden="true" />
          </MenuButton>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <MenuItem>
                <button
                  type="button"
                  className="block px-3 py-1 text-sm leading-6 text-left w-full border-b-1 border-slate-200 text-gray-900 cursor-pointer"
                  onClick={() =>
                    navigate(`${location.pathname}?viewTaskId=${task._id}`)
                  }
                >
                  Ver Tarea
                </button>
              </MenuItem>
              {canEdit && (
                <>
                  <MenuItem>
                    <button
                      type="button"
                      className="block px-3 py-1 text-sm leading-6 text-left w-full border-b-1 border-slate-200 text-gray-900 cursor-pointer"
                      onClick={() =>
                        navigate(`${location.pathname}?editTaskId=${task._id}`)
                      }
                    >
                      Editar Tarea
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      type="button"
                      className="block px-3 py-1 text-sm leading-6 text-left w-full text-red-500 cursor-pointer"
                      onClick={() => mutate({ projectId, taskId: task._id })}
                    >
                      Eliminar Tarea
                    </button>
                  </MenuItem>
                </>
              )}
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </li>
  );
}
