import { Navigate, useLocation, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getTaskById } from "../../services/TaskService";
import EditTaskModal from "./EditTaskModal";
export default function EditTaskData() {
  const params = useParams();
  const { projectId } = params;
  const location = useLocation();
  const queryparams = new URLSearchParams(location.search);
  const editTaskId = queryparams.get("editTaskId");

  const { data, isError } = useQuery({
    queryKey: ["task", editTaskId],
    queryFn: () => getTaskById({ projectId: projectId!, taskId: editTaskId! }),
    enabled: !!editTaskId,
    retry: false,
  });
  if (isError) return <Navigate to={`/404`} replace />;
  if(data) return <EditTaskModal task={data} />;
}
