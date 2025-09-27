import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import type { ProjectFormData } from "../../types";
import { createProject } from "../../services/ProjectService";
import ProjectForm from "../../components/projects/ProjectForm";


export default function CreateProjectView() {
  const initialValues : ProjectFormData = { projectName: "", clientName: "", description: "" };
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });

  const mutation = useMutation({
    mutationFn: createProject, // Llama a la funcion de creacion de proyecto del servicio
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate("/");
    },
  });

  const handleFormSubmit = (formData: ProjectFormData) => {
    // React Query gestiona la asincornia y el estado de la peticion
    mutation.mutate(formData);
  };

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black">Crear Proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5 ">
          Llena el formulario para crear un nuevo proyecto
        </p>
        <Link
          className="bg-amber-500 hover:bg-orange-400 px-10 py-3 rounded-lg text-white font-bold uppercase mt-5 inline-block"
          to="/"
        >
          Volver a Proyectos
        </Link>

        <form
          className="mt-10 bg-white shadow-lg p-10 rounded-lg"
          onSubmit={handleSubmit(handleFormSubmit)}
          noValidate
        >
          <ProjectForm register={register} errors={errors} />
          <input
            type="submit"
            value="Crear Proyecto"
            className=" bg-amber-500 w-full p-3 text-white uppercase rounded-lg font-bold hover:bg-orange-400 cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
