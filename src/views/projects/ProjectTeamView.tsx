import { Link, useNavigate, useParams } from "react-router-dom";
import AddMemberModal from "../../components/teams/AddMemberModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getProjectTeam,
  removeMemberFromProject,
} from "../../services/TeamServices";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { Fragment } from "react/jsx-runtime";
import { toast } from "react-toastify";
import Spinner from "../../components/Spinner";

export default function ProjectTeamView() {
  const navigate = useNavigate();
  const params = useParams();
  const projectId = params.projectId!;
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projectTeam", projectId],
    queryFn: () => getProjectTeam(projectId),
  });

  const { mutate } = useMutation({
    mutationFn: removeMemberFromProject,
    onError: (error) => {
      toast.error((error as Error).message);
    },
    onSuccess: (data) => {
      toast.success(data);
      queryClient.invalidateQueries({ queryKey: ["projectTeam", projectId] });
    },
  });

  const handleDeleteMember = (memberId: string) => {
    mutate({ projectId, memberId });
  };

  if (isLoading) return <Spinner />;
  if (isError)
    return <p className="text-red-500">Error: {(error as Error).message}</p>;

  if (data)
    return (
      <>
        <h1 className="text-5xl font-black max-w-3xl">Administrar Equipo</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">
          Administra y agrega colaboradores a este proyecto
        </p>

        <nav className="my-5 flex gap-3">
          <button
            type="button"
            className=" text-white rounded-lg bg-amber-500 hover:cursor-pointer hover:bg-orange-400 px-10 py-3 text-xl cursor-pointer font-bold transition-colors"
            onClick={() => navigate(`${location.pathname}?addMember=true`)}
          >
            Añadir Colaborador
          </button>
          <Link
            to={`/projects/${projectId}`}
            className=" text-white rounded-lg bg-slate-700 hover:cursor-pointer hover:bg-slate-800 px-10 py-3 text-xl cursor-pointer font-bold transition-colors"
          >
            Volver al Proyecto
          </Link>
        </nav>
        <h2 className="text-5xl font-black my-10">Miembros actuales</h2>
        {data.length ? (
          <ul
            role="list"
            className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg"
          >
            {data?.map((member) => (
              <li
                key={member._id}
                className="flex justify-between gap-x-6 px-5 py-10"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <p className="text-2xl font-black text-gray-600">
                      {member.name}
                    </p>
                    <p className="text-sm text-gray-400">{member.email}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-x-6">
                  <Menu as="div" className="relative flex-none">
                    <MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
                      <span className="sr-only">opciones</span>
                      <EllipsisVerticalIcon
                        className="h-9 w-9"
                        aria-hidden="true"
                      />
                    </MenuButton>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white hover:bg-red-500 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <MenuItem>
                          <button
                            type="button"
                            className="block px-3 py-1 text-sm leading-6 text-red-500 cursor-pointer hover:bg-red-500 hover:text-white w-full text-left"
                            onClick={() => handleDeleteMember(member._id)}
                          >
                            Eliminar del Proyecto
                          </button>
                        </MenuItem>
                      </MenuItems>
                    </Transition>
                  </Menu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center py-20">No hay miembros en este equipo</p>
        )}
        <AddMemberModal />
      </>
    );
}
