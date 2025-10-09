import { Fragment } from "react";
import type { TaskProject } from "../../types";
import { useDraggable } from "@dnd-kit/core";
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
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task._id,
    });
  const projectId = params.projectId!;
  const statusStyles: { [key: string]: string } = {
    pending: "border-l-amber-500",
    onHold: "border-l-red-500",
    inProgress: "border-l-blue-500",
    underReview: "border-l-purple-500",
    completed: "border-l-green-500",
  };
    const queryparams = new URLSearchParams(location.search);
  const viewTaskId = queryparams.get("viewTaskId");
  const showMenu = viewTaskId !== null || isDragging ;
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

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    cursor: "grab",
  };

  return (
    <>
      <div
        onDoubleClick={() =>
          navigate(`${location.pathname}?viewTaskId=${task._id}`)
        }
        className="relative w-full"
      >
        {!showMenu && (
          <div className="absolute top-3 right-3 z-20">
            <Menu as="div" className="relative">
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
                <MenuItems className="absolute right-0 z-30 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                  <MenuItem>
                    <button
                      type='button'
                      className="block px-3 py-1 text-sm leading-6 text-left w-full border-b border-slate-200 text-gray-900 hover:bg-gray-50"
                      onClick={() => navigate(location.pathname + `?viewTaskId=${task._id}`)}
                    >
                      Ver Tarea
                    </button>
                  </MenuItem>
                  {canEdit && (
                    <>
                      <MenuItem>
                        <button
                          type="button"
                          className="block px-3 py-1 text-sm leading-6 text-left w-full border-b border-slate-200 text-gray-900 hover:bg-gray-50"
                          onClick={() =>
                            navigate(
                              `${location.pathname}?editTaskId=${task._id}`
                            )
                          }
                        >
                          Editar Tarea
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button
                          type="button"
                          className="block px-3 py-1 text-sm leading-6 text-left w-full text-red-500 hover:bg-red-50"
                          onClick={() =>
                            mutate({ projectId, taskId: task._id })
                          }
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
        )}

        <li
          {...listeners}
          {...attributes}
          ref={setNodeRef}
          style={style}
          className={`p-5 bg-white border border-slate-300 w-full flex justify-between 
      gap-3 rounded-lg shadow-md hover:shadow-lg transition-shadow border-l-4 
      ${
        statusStyles[task.status]
      } `}
        >
          <div className="min-w-0 flex flex-col gap-y-4 pr-10">
            <p
              
              className="text-xl font-bold text-left text-slate-600"
            >
              {task.name}
            </p>
            <p className="text-slate-500">{task.description}</p>
          </div>
        </li>
      </div>
    </>
  );
}
