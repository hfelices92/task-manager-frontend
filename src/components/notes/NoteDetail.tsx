import { useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import type { Note } from "../../types";
import { formatDate } from "../../utils/utils";
import { useLocation, useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/NoteService";
import { toast } from "react-toastify";

type NoteDetailProps = {
  note: Note;
};

export default function NoteDetail({ note }: NoteDetailProps) {
  const { data, isLoading } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const taskId = queryParams.get("viewTaskId")!;
  const params = useParams();
  const projectId = params.projectId!;

  const queryClient = useQueryClient()
  const {mutate} = useMutation({
    mutationFn: deleteNote,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
        
      toast.success(data);
        queryClient.invalidateQueries({queryKey: ['task', taskId]})
    },
  });

  const canDelete = useMemo(() => {
    return data?._id === note.createdBy._id;
  }, [data, note]);
  const handleDelete = () => {
    mutate({projectId, taskId, noteId: note._id});
  };
  if (isLoading) return <p>Cargando...</p>;
  if (data)
    return (
      <>
        <div className="p-3 bg-white my-2 rounded-lg">
          {canDelete && (
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg font-bold cursor-pointer text-white transition-colors "
                onClick={handleDelete}
              >
                Eliminar
              </button>
            </div>
          )}
          <p className="text-lg">{note.content}</p>

          <p className="font-bold text-amber-500 text-end">
            {note.createdBy.name} - {note.createdBy.email}
          </p>
          <p className="text-xs text-slate-400 text-end">
            {formatDate(note.createdAt)}
          </p>
        </div>
      </>
    );
}
