import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import type { Task, TaskFormData } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import TaskForm from "./TaskForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { updateTask } from "../../services/TaskService";
type EditTaskModalProps = {
  task: Task;
};
export default function EditTaskModal({ task }: EditTaskModalProps) {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<TaskFormData>({
    defaultValues: {
      name: task.name,
      description: task.description,
    },
  });
  const queryClient = useQueryClient();
  const {mutate} = useMutation({
    mutationFn: updateTask,
    onError: (error: Error) => {
     toast.error(error.message);
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["project", task.project] });
          queryClient.invalidateQueries({ queryKey: ["task", task._id] });
        reset();
        toast.success("Tarea actualizada correctamente");
        navigate(location.pathname, { replace: true });
    }
  })
  const handleUpdateTask = (formData: TaskFormData) => {
    const data = { formData, projectId: task.project, taskId: task._id };
    mutate(data);
  };
  return (
    <Transition appear show={true} as={Fragment}>
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
                <DialogTitle
                  as="h3"
                  className="font-black text-4xl  my-5 first-letter:text-amber-500"
                >
                  Editar Tarea
                </DialogTitle>

                <p className="text-xl font-bold ">
                  Realiza cambios a una tarea en {""}
                  <span className="text-amber-500">este formulario</span>
                </p>

                <form
                  className="mt-10 space-y-3"
                  noValidate
                  onSubmit={handleSubmit(handleUpdateTask)}
                >
                  <TaskForm errors={errors} register={register} />
                  <input
                    type="submit"
                    value="Guardar Tarea"
                    className=" bg-amber-500 w-full p-3 text-white uppercase rounded-lg font-bold hover:bg-orange-400 cursor-pointer transition-colors"
                  />
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
