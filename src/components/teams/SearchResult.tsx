import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { TeamMember } from "../../types";
import { addMemberToProject } from "../../services/TeamServices";
import { toast } from "react-toastify";
import {  useParams } from "react-router-dom";

type SearchResultProps = {
  user: TeamMember;
  reset: () => void;
};
export default function SearchResult({ user, reset }: SearchResultProps) {
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: addMemberToProject,
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
      reset()
    },
    onError: (error: any) => {
      toast.error(error.message);
    },
  });

  const handleAddMember = () => {
    const data = { projectId, memberId: user._id };
    mutate(data);
  };
  return (
    <>
      <p className="mt-10 text-center font-bold text-xl">Resultado:</p>
      <div className="flex justify-between items-center">
        <p className=" text-xl">
          {user.name} - {user.email}
        </p>
        <button
          className="rounded-lg text-amber-500 hover:cursor-pointer hover:text-orange-300   p-3   font-black  cursor-pointer"
          onClick={handleAddMember}
        >
          Añadir al equipo
        </button>
      </div>
    </>
  );
}
