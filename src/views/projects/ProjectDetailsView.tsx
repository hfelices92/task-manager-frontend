import { getProjectByID } from "../../services/ProjectService";
import { useQuery } from "@tanstack/react-query";

import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import AddTaskModal from "../../components/tasks/AddTaskModal";
import TaskList from "../../components/tasks/TaskList";
import EditTaskData from "../../components/tasks/EditTaskData";
import TaskModalDetails from "../../components/tasks/TaskModalDetails";
import { useAuth } from "../../hooks/useAuth";
import { isManager } from "../../utils/policies";
import { useMemo } from "react";
import Spinner from "../../components/Spinner";

export default function EditProjectView() {
  const navigate = useNavigate();
  const { data: user, isLoading: authLoading } = useAuth();
  const { projectId } = useParams();
  const { data, isError, isLoading } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProjectByID(projectId!),
    retry: false,
  });
  const canEdit = useMemo(() => {
    return data?.manager === user?._id;
  }, [data, user]);

  if (isLoading && authLoading) return <Spinner />;
  if (isError) return <Navigate to="/404" replace />;

  if (data && user)
    return (
      <>
        <h1 className="text-5xl font-black max-w-3xl first-letter:text-amber-500">{data.projectName}</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          {data.description}
        </p>

        {isManager(data.manager, user._id) && (
          <nav className="my-5 flex gap-3">
            <button
              type="button"
              className=" text-white rounded-lg bg-amber-500 hover:cursor-pointer hover:bg-orange-400 px-10 py-3 text-xl cursor-pointer font-bold transition-colors"
              onClick={() => navigate(`${location.pathname}?newTask=true`)}
            >
              Añadir Tarea
            </button>
            <Link
              to={"team"}
              className=" text-white rounded-lg bg-slate-700 hover:cursor-pointer hover:bg-slate-800 px-10 py-3 text-xl cursor-pointer font-bold transition-colors"
            >
              Colaboradores
            </Link>
          </nav>
        )}

        <TaskList tasks={data.tasks} canEdit={canEdit} />

        <AddTaskModal />
        <EditTaskData />
        <TaskModalDetails />
      </>
    );
}
