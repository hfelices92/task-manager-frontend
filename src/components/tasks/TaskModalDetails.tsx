import { Fragment, useEffect } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getTaskById, updateTaskStatus } from "../../services/TaskService";
import { toast } from "react-toastify";
import { formatDate } from "../../utils/utils";
import { statusTranslations } from "../../locales/es";
import type { TaskStatus } from "../../types";

export default function TaskModalDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryparams = new URLSearchParams(location.search);
  const viewTaskId = queryparams.get("viewTaskId");
  const showModal = viewTaskId !== null;
  const params = useParams();
  const { projectId } = params;

  const { data, isError } = useQuery({
    queryKey: ["task", viewTaskId],
    queryFn: () => getTaskById({ projectId: projectId!, taskId: viewTaskId! }),
    enabled: !!viewTaskId,
    retry: false,
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: updateTaskStatus,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["task", viewTaskId] });
      toast.success("Estado de la tarea actualizado");
    },
  });

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as TaskStatus;
    const data = {
      projectId: projectId!,
      taskId: viewTaskId!,
      status: newStatus,
    };
    mutate(data);
  };
  useEffect(() => {
    if (isError) {
      toast.error("La tarea que intentas ver no existe", {
        toastId: "viewTaskError",
      });
    }
  }, [isError]);
  if (isError) {
    return <Navigate to={`/projects/${projectId}`} />;
  }

  if (data)
    return (
      <>
        <Transition appear show={showModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => navigate(location.pathname, { replace: true })}
          >
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/60" />
            </TransitionChild>

            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <TransitionChild
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <DialogPanel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all p-16">
                    <p className="text-sm text-slate-400">
                      Creada el: {formatDate(data.createdAt)}
                    </p>
                    <p className="text-sm text-slate-400">
                      Última actualización: {formatDate(data.updatedAt)}
                    </p>
                    <DialogTitle
                      as="h3"
                      className="font-black text-4xl text-slate-600 my-5 first-letter:text-amber-500"
                    >
                      {data.name}
                    </DialogTitle>
                    <p className="text-lg text-slate-500 mb-2">
                      Descripción:{data.description}
                    </p>
                    <div className="my-5 space-y-3">
                      <label className="font-bold">Estado Actual:</label>
                      <select
                        name=""
                        id=""
                        onChange={handleStatusChange}
                        value={data.status}
                        className="w-full bg-white border border-slate-300 rounded-md p-2 text-slate-600 font-medium"
                      >
                        {Object.entries(statusTranslations).map(
                          ([key, value]) => (
                            <option
                              key={key}
                              value={key}
                              selected={data.status === key}
                            >
                              {value}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  </DialogPanel>
                </TransitionChild>
              </div>
            </div>
          </Dialog>
        </Transition>
      </>
    );
}
