import { Outlet } from "react-router-dom";
import Logo from "../components/Logo";
import { ToastContainer } from "react-toastify";

export default function AuthLayout() {
  return (
    <>
      <div className="bg-gray-800 min-h-screen ">
        <div className="py-10 lg:py-20 mx-auto sm:w-[450px]">
          <div className="flex justify-center"><Logo logoVariant="medio"  /></div>
          <div className="mt-10 ">
            <Outlet />
          </div>
        </div>
      </div>
      <ToastContainer
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      autoClose={2000}
       />
    </>
  );
}
