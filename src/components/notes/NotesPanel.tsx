import type { Task } from "../../types";
import AddNoteForm from "./AddNoteForm";
import NoteDetail from "./NoteDetail";

type NotesPanelProps = {
  notes: Task["notes"];
};
export default function NotesPanel({ notes }: NotesPanelProps) {
 
  return (
    <>
      <AddNoteForm />
      {notes.length > 0 ? (
        <div className="mb-4">
          <p className="text-lg font-bold text-slate-600 my-3">Notas:</p>

          {notes.map((note) => (
            <NoteDetail key={note._id} note={note} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mb-4 text-center">
          No hay notas para esta tarea.
        </p>
      )}
    </>
  );
}
