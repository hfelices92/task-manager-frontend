import ProjectForm from "./ProjectForm";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import type { ProjectFormData } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { updateProjectByID } from "../../services/ProjectService";
import { toast } from "react-toastify";

type EditProjectFormProps = {
  data: ProjectFormData;
};
export default function EditProjectForm({ data }: EditProjectFormProps) {
    const { projectId } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      projectName: data.projectName,
      clientName: data.clientName,
      description: data.description,
    },
  });
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: updateProjectByID,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate("/");
    },
  });

  const handleFormSubmit = (formData: ProjectFormData) => {
    const data = { id: projectId!, formData };
    mutation.mutate(data);
  };
  return (
    <>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black">Editar Proyecto</h1>
        <p className="text-2xl font-light text-gray-500 mt-5 ">
          Llena el formulario para editar el proyecto
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
            value="Guardar Cambios"
            className=" bg-amber-500 w-full p-3 text-white uppercase rounded-lg font-bold hover:bg-orange-400 cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  );
}
