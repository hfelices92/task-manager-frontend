import { getProjectByID } from "../../services/ProjectService";
import { useQuery } from "@tanstack/react-query";

import { Navigate, useNavigate, useParams } from "react-router-dom";
import AddTaskModal from "../../components/tasks/AddTaskModal";
import TaskList from "../../components/tasks/TaskList";
import EditTaskData from "../../components/tasks/EditTaskData";
import TaskModalDetails from "../../components/tasks/TaskModalDetails";

export default function EditProjectView() {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectByID(projectId!),
    retry: false,
  });

  if (isLoading) return "Cargando...";
  if (isError) return <Navigate to="/404" replace />;

  if (data)
    return (
      <>
        <h1 className="text-5xl font-black max-w-3xl">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          {data.description}
        </p>

        <nav className="my-5 flex gap-3">
          <button
            type="button"
            className=" text-white rounded-lg bg-amber-500 hover:cursor-pointer hover:bg-orange-400 px-10 py-3 text-xl cursor-pointer font-bold transition-colors"
            onClick={() => navigate(`${location.pathname}?newTask=true`)}
          >
            Añadir Tarea
          </button>
        </nav>

        <TaskList tasks={data.tasks} />

        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
}
