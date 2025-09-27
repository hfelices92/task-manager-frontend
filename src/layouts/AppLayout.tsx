import { Link, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Logo from "../components/Logo";
import NavMenu from "../components/NavMenu";
export default function AppLayout() {
  return (
    <>
      <header className="bg-gray-800 py-5">
        <div className="max-w-screen-2xl mx-auto flex flex-col px-5 lg:flex-row justify-between items-center">
         <div className="w-50 m-1 ">
          <Link to="/">
            <Logo logoVariant="medio" />
          </Link>
          </div>
          <NavMenu />
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
      autoClose={2000}
       />
    </>
  );
}
