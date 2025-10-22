import { Link, Outlet, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../components/Logo";
import NavMenu from "../components/NavMenu";
import { useAuth } from "../hooks/useAuth";
import Spinner from "../components/Spinner";
export default function AppLayout() {
  const { data, isError, isLoading } = useAuth();

  if (isLoading) {
    return <Spinner />;
  }

  if (isError) {
    return <Navigate to="/auth/login" />;
  }
  if (data)
    return (
      <>
        <header className="bg-gray-800 py-5">
          <div className="max-w-screen-2xl mx-auto flex flex-col px-5 lg:flex-row justify-between items-center">
            <div className="w-50 m-1 ">
              <Link to="/">
                <Logo logoVariant="medio" />
              </Link>
            </div>
            <NavMenu name={data.name} />
          </div>
        </header>
        <section className="max-w-screen-2xl mx-auto p-5 mt-10">
          <Outlet />
        </section>

        <footer className="py-2 flex flex-col  items-center mt-20">
          <div className="w-20 ">
            <Logo logoVariant="icono" />
          </div>
          <div className="w-56 mt-1">
            <Logo logoVariant="firma" />
          </div>

          <p className="text-center mt-3 text-slate-500">
            Todos los derechos reservados {new Date().getFullYear()}
          </p>
        </footer>
        <ToastContainer
          pauseOnHover={false}
          pauseOnFocusLoss={false}
          autoClose={3000}
        />
      </>
    );
}
