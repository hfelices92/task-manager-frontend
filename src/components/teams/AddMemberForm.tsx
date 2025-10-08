import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import ErrorMessage from "../ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import type { TeamMemberForm } from "../../types";
import { findUserByEmail } from "../../services/TeamServices";
import SearchResult from "./SearchResult";

export default function AddMemberForm() {
  const initialValues: TeamMemberForm = {
    email: "",
  };
  const params = useParams();
  const projectId = params.projectId!;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const mutation = useMutation({
    mutationFn: findUserByEmail,
  });

  const handleSearchUser = async (formData: TeamMemberForm) => {
    const data = {projectId, formData};
    mutation.mutate(data);
    
  };
  const resetData = () => {
    reset();
    mutation.reset();
  }
  return (
    <>
      <form
        className="mt-10 space-y-5"
        onSubmit={handleSubmit(handleSearchUser)}
        noValidate
      >
        <div className="flex flex-col gap-3">
          <label className="font-normal text-2xl" htmlFor="name">
            E-mail de Usuario
          </label>
          <input
            id="name"
            type="text"
            placeholder="E-mail del usuario a Agregar"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "El Email es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <input
          type="submit"
          className=" rounded-lg bg-amber-500 hover:cursor-pointer hover:bg-orange-400 w-full p-3  text-white font-black  text-xl cursor-pointer"
          value="Buscar Usuario"
        />
      </form>
      <div className="mt-5">
        
      {mutation.isPending && <p className="text-center ">Buscando usuario...</p>}
        {mutation.isError && <ErrorMessage>{(mutation.error as Error).message}</ErrorMessage>}
        {mutation.isSuccess && mutation.data && (
            <SearchResult user={mutation.data}  reset={resetData} />
        )}
      </div>
    </>
  );
}
