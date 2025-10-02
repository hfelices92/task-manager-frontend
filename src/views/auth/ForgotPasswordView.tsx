import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import type { ForgotPasswordForm } from "../../types";
import ErrorMessage from "../../components/ErrorMessage";
import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../../services/AuthService";
import { toast } from "react-toastify";

export default function ForgotPasswordView() {
  const initialValues: ForgotPasswordForm = {
    email: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });
  const { mutate } = useMutation({
    mutationFn: forgotPassword,
    onError: (error: any) => {
      console.log(error);
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
    },
  });

  const handleForgotPassword = (formData: ForgotPasswordForm) => {
    mutate(formData);
  };

  return (
    <>
      <h1 className="text-5xl font-black text-white ">
        Reestablecer Contraseña
      </h1>
      <p className="text-2xl font-light text-white mt-5">
        ¿Olvidaste tu contraseña? <br />
        Introduce tu email y{""}
        <span className=" text-amber-500 font-bold">
          {" "}
          reestablece tu contraseña
        </span>
      </p>

      <form
        onSubmit={handleSubmit(handleForgotPassword)}
        className="space-y-8 p-10 mt-4 bg-white sm:rounded-lg"
        noValidate
      >
        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("email", {
              required: "El Email de registro es obligatorio",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "E-mail no válido",
              },
            })}
          />
          {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
        </div>

        <input
          type="submit"
          value="Enviar Instrucciones"
          className="bg-amber-500 hover:bg-orange-400 rounded-lg w-full p-3  text-white font-bold  text-xl cursor-pointer"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/login"
          className="text-center text-gray-300 font-normal"
        >
          ¿Ya tienes cuenta?{" "}
          <span className="text-amber-500">Iniciar Sesión</span>
        </Link>

        <Link
          to="/auth/register"
          className="text-center text-gray-300 font-normal"
        >
          ¿No tienes cuenta? <span className="text-amber-500">Regístrate</span>
        </Link>
      </nav>
    </>
  );
}
