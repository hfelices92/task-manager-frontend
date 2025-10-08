import { useForm } from "react-hook-form";
import type { UserRegistrationForm } from "../../types/index";
import ErrorMessage from "../../components/ErrorMessage";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { createAcount } from "../../services/AuthService";
import { toast } from "react-toastify";

export default function RegisterView() {
  const initialValues: UserRegistrationForm = {
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  };

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<UserRegistrationForm>({ defaultValues: initialValues });
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: createAcount,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
      navigate("/auth/confirm-account");
    },
  });

  const handleRegister = (formData: UserRegistrationForm) => {
    mutate(formData);
  };

  return (
    <>
      <h1 className="text-5xl font-black text-white ">Crear Cuenta</h1>
      <p className="text-2xl font-light text-white mt-5">
        Llena el formulario para {""}
        <span className=" text-amber-500 font-bold"> crear tu cuenta</span>
      </p>

      <form
        onSubmit={handleSubmit(handleRegister)}
        className="space-y-8 p-10  bg-white mt-10 sm:rounded-lg"
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

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Nombre</label>
          <input
            type="name"
            placeholder="Nombre de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("name", {
              required: "El Nombre de usuario es obligatorio",
            })}
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Password</label>

          <input
            type="password"
            placeholder="Password de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("password", {
              required: "El Password es obligatorio",
              minLength: {
                value: 8,
                message: "El Password debe ser mínimo de 8 caracteres",
              },
            })}
          />
          {errors.password && (
            <ErrorMessage>{errors.password.message}</ErrorMessage>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <label className="font-normal text-2xl">Repetir Password</label>

          <input
            id="passwordConfirmation"
            type="password"
            placeholder="Repite Password de Registro"
            className="w-full p-3  border-gray-300 border"
            {...register("passwordConfirmation", {
              required: "Repetir Password es obligatorio",
              validate: (value) =>
                value === watch("password") || "Los Passwords no son iguales",
            })}
          />

          {errors.passwordConfirmation && (
            <ErrorMessage>{errors.passwordConfirmation.message}</ErrorMessage>
          )}
        </div>

        <input
          type="submit"
          value="Registrarme"
          className="bg-amber-500 hover:bg-orange-400 rounded-lg w-full p-3  text-white font-bold  text-xl cursor-pointer"
        />
      </form>

      <nav className="mt-10 flex flex-col space-y-2">
        <Link to={"/auth/login"} className="text-center text-gray-300">
          ¿Ya tienes una cuenta?{" "}
          <span className="text-amber-500">Inicia Sesión</span>
        </Link>
        <Link
          to={"/auth/forgot-password"}
          className="text-center text-gray-300"
        >
          ¿Olvidates tu contraseña?{" "}
          <span className="text-amber-500">Reestablecer.</span>
        </Link>
      </nav>
    </>
  );
}
