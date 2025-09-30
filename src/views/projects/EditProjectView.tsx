import EditProjectForm from "../../components/projects/EditProjectForm";
import { getProjectByID } from "../../services/ProjectService";
import { useQuery } from "@tanstack/react-query";

import { Navigate, useParams } from "react-router-dom";

export default function EditProjectView() {
  const { projectId } = useParams();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["editProject", projectId],
    queryFn: () => getProjectByID(projectId!),
    retry: false,
  });

  if (isLoading) return "Cargando...";
  if (isError) return <Navigate to="/404" replace />;

  if (data)
    return (
      <>
        <EditProjectForm data={data}/>
      </>
    );
}
