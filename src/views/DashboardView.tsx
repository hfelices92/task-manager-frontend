import { deleteProjectByID, getProjects } from "../services/ProjectService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { Fragment, useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { toast } from "react-toastify";

export default function DashboardView() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
  });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: deleteProjectByID,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data: String) => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success(data);
      navigate("/");
    },
  });

  const handleDelete = (id: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este proyecto?")) {
      mutation.mutate(id);
    }
  };

  // ---- 👇 lógica para truncar según el tamaño de pantalla
  const [maxChars, setMaxChars] = useState(24);

  useEffect(() => {
    const updateMaxChars = () => {
      if (window.innerWidth < 768) {
        setMaxChars(15); // md o inferior
      } else {
        setMaxChars(48); // pantallas grandes
      }
    };

    updateMaxChars();
    window.addEventListener("resize", updateMaxChars);
    return () => window.removeEventListener("resize", updateMaxChars);
  }, []);

  const getTruncatedName = (name: string) =>
    name.length > maxChars ? name.slice(0, maxChars) + "…" : name;
  // ---- 👆

  if (isLoading) return "Cargando...";

  if (data)
    return (
      <>
        <h1 className="text-5xl font-black">Mis Proyectos</h1>
        <p className="text-2xl font-light text-gray-500 mt-5 ">
          Desde aquí podrás administrar tus proyectos y tareas
        </p>
        <nav className="my-2">
          <Link
            className="bg-amber-500 hover:bg-orange-400 px-10 py-3 rounded-lg text-white font-bold uppercase mt-5 inline-block"
            to="/projects/create"
          >
            Nuevo Proyecto
          </Link>
        </nav>

        {isError && (
          <p className="text-red-600 font-bold">
            Hubo un error al cargar los proyectos
          </p>
        )}
        {data.length ? (
          <ul
            role="list"
            className="divide-y divide-gray-100 border border-gray-100 mt-10 bg-white shadow-lg"
          >
            {data.map((project) => (
              <li
                key={project._id}
                className="flex justify-between gap-x-6 px-5 py-10"
              >
                <div className="flex min-w-0 gap-x-4">
                  <div className="min-w-0 flex-auto space-y-2">
                    <Link
                      to={`projects/${project._id}`}
                      className="text-gray-600 cursor-pointer hover:underline text-3xl font-bold"
                    >
                      {getTruncatedName(project.projectName)}
                    </Link>
                    <p className="text-sm text-gray-400">
                      Cliente: {project.clientName}
                    </p>
                    <p className="text-sm text-gray-400">
                      {project.description}
                    </p>
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
                      <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
                        <MenuItem>
                          <Link
                            to={`projects/${project._id}`}
                            className="block px-3 py-1 text-sm leading-6 text-gray-900"
                          >
                            Ver Proyecto
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <Link
                            to={`projects/${project._id}/edit`}
                            className="block px-3 py-1 text-sm leading-6 text-gray-900"
                          >
                            Editar Proyecto
                          </Link>
                        </MenuItem>
                        <MenuItem>
                          <button
                            type="button"
                            className="block px-3 py-1 text-sm leading-6 text-red-500 cursor-pointer w-full text-left"
                            onClick={() => handleDelete(project._id)}
                          >
                            Eliminar Proyecto
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
          <p className="text-center py-20">
            Todavía no hay proyectos{" "}
            <Link to={"projects/create"} className="text-amber-500 font-bold">
              {" "}
              Crear un proyecto
            </Link>
          </p>
        )}
      </>
    );
}
