
export default function Spinner() {
  return (
    <>
    <div className="flex flex-col items-center h-screen justify-center">

    <img src="/logo_icono.png" alt="" style={{ animation: "spin 5s linear infinite" }} />
    <h1 className="font-bold text-3xl uppercase text-amber-600 animate-pulse">Cargando</h1>
    </div>
    </>
  )
}
