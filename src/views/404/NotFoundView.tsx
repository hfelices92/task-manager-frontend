import { Link } from "react-router-dom";
import Logo from "../../components/Logo";

export default function NotFoundView() {
  return (
    <>
      <h1
        className="font-black text-center text-4xl "
        style={{ color: "#F17037" }}
      >
        Página No Encontrada
      </h1>
      <h1
        className="font-black text-center text-6xl   "
        style={{ color: "#F17037" }}
      >
        404
      </h1>
      <p className="mt-5 text-white text-center">
        Pincha aquí para volver a tus{" "}
        <Link to={"/"} className="font-bold" style={{ color: "#F17037" }}>
          Proyectos
        </Link>
      </p>
      <footer className="py-2 flex flex-col items-center mt-46 mx-auto">
        <div className="w-16 ">
          <Logo logoVariant="icono" />
        </div>
        <div className="w-54 mt-1">
          <Logo logoVariant="firma" />
        </div>

        <p className="text-center mt-3 text-slate-100 text-sm">
          Todos los derechos reservados {new Date().getFullYear()}
        </p>
      </footer>
    </>
  );
}
