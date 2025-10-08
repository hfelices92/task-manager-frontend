import { Fragment } from "react";
import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../ErrorMessage";
import type { CheckPasswordForm } from "../../types";
import { toast } from "react-toastify";
import { checkPassword } from "../../services/AuthService";
import { deleteProjectByID } from "../../services/ProjectService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function DeleteProjectModal() {
  const initialValues: CheckPasswordForm = {
    password: "",
  };
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const queryParams = new URLSearchParams(location.search);
  const deleteProjectId = queryParams.get("deleteProject")!;
  const show = deleteProjectId ? true : false;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const checkUserPasswordMutation = useMutation({
    mutationFn: checkPassword,
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

   const deleteProjectMutation = useMutation({
     mutationFn: deleteProjectByID,
     onError: (error: Error) => {
       toast.error(error.message);
     },
     onSuccess: (data: any) => {
        
       queryClient.invalidateQueries({ queryKey: ["projects"] });
         navigate(location.pathname, { replace: true });
       toast.success(data.message);
     },
   });
  const handleForm = async (formData: CheckPasswordForm) => {
    await checkUserPasswordMutation.mutateAsync(formData);
    await deleteProjectMutation.mutateAsync(deleteProjectId);
  };

  return (
    <Transition appear show={show} as={Fragment}>
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
                <DialogTitle as="h3" className="font-black text-4xl  my-5">
                  Eliminar Proyecto{" "}
                </DialogTitle>

                <p className="text-xl font-bold">
                  Confirma la eliminación del proyecto {""}
                  <span className="text-amber-500">
                    colocando tu contraseña
                  </span>
                </p>

                <form
                  className="mt-10 space-y-5"
                  onSubmit={handleSubmit(handleForm)}
                  noValidate
                >
                  <div className="flex flex-col gap-3">
                    <label className="font-normal text-2xl" htmlFor="password">
                      Contraseña
                    </label>
                    <input
                      id="password"
                      type="password"
                      placeholder="Intoduce tu contraseña"
                      className="w-full p-3  border-gray-300 border"
                      {...register("password", {
                        required: "El password es obligatorio",
                      })}
                    />
                    {errors.password && (
                      <ErrorMessage>{errors.password.message}</ErrorMessage>
                    )}
                  </div>

                  <input
                    type="submit"
                    className=" bg-amber-500 hover:bg-orange-400 rounded-lg w-full p-3  text-white font-black  text-xl cursor-pointer"
                    value="Eliminar Proyecto"
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
