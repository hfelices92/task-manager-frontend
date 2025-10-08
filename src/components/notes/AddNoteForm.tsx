import { useForm } from "react-hook-form";
import type { NoteFormData } from "../../types";
import ErrorMessage from "../ErrorMessage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createNote } from "../../services/NoteService";
import { toast } from "react-toastify";
import { useLocation, useParams } from "react-router-dom";

export default function AddNoteForm() {
  const initialValues: NoteFormData = {
    content: "",
  };
  const params = useParams();
  const location = useLocation();
  const queryparams = new URLSearchParams(location.search);
  const projectId = params.projectId!;
  const taskId = queryparams.get("viewTaskId")!;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ defaultValues: initialValues });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: createNote,
    onError: (error: Error) => toast.error(error.message),
    onSuccess: (data) => {
      toast.success(data.data);
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      setValue("content", ""); 
    },
  });
  const handleAddNote = (formData: NoteFormData) => {
    const data = {
      formData,
      projectId,
      taskId: taskId,
    };
    mutate(data);
  };
  return (
    <form
      action=""
      onSubmit={handleSubmit(handleAddNote)}
      className="space-y-3"
      noValidate
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="font-bold">
          Crear Nota:
        </label>
        <input
          type="text"
          id="content"
          placeholder="Escribe tu nota"
          className="w-full p-3 border border-gray-300 bg-white"
          {...register("content", {
            required: "El contenido es obligatorio",
          })}
        />
        {errors.content && (
          <ErrorMessage>{errors.content.message}</ErrorMessage>
        )}
      </div>

      <input
        type="submit"
        value="Crear Nota"
        className="bg-amber-500 hover:bg-orange-400 rounded-lg w-full p-2 font-black text-white cursor-pointer"
      />
    </form>
  );
}
