import { useForm } from "react-hook-form"
import ErrorMessage from "../../components/ErrorMessage"
import type { ChangePasswordForm } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../../services/ProfileService";
import { toast } from "react-toastify";

export default function ChangePasswordView() {
  const initialValues : ChangePasswordForm = {
    currentPassword: '',
    password: '',
    passwordConfirmation: ''
  }

  const { register, handleSubmit, watch, formState: { errors } } = useForm({ defaultValues: initialValues })
  const {mutate} = useMutation({
    mutationFn: changePassword,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
    }
  })

  

  const handleChangePassword = (formData: ChangePasswordForm) => {
    mutate(formData)  
   }

  return (
    <>
      <div className="mx-auto max-w-3xl">

        <h1 className="text-5xl font-black ">Cambiar Contraseña</h1>
        <p className="text-2xl font-light text-gray-500 mt-5">Utiliza este formulario para cambiar tu contraseña</p>

        <form
          onSubmit={handleSubmit(handleChangePassword)}
          className=" mt-14 space-y-5 bg-white shadow-lg p-10 rounded-lg"
          noValidate
        >
          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="currentPassword"
            >Contraseña Actual</label>
            <input
              id="currentPassword"
              type="password"
              placeholder="Password Actual"
              className="w-full p-3  border border-gray-200"
              {...register("currentPassword", {
                required: "La contraseña actual es obligatoria",
              })}
            />
            {errors.currentPassword && (
              <ErrorMessage>{errors.currentPassword.message}</ErrorMessage>
            )}
          </div>

          <div className="mb-5 space-y-3">
            <label
              className="text-sm uppercase font-bold"
              htmlFor="password"
            >Nueva Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Nueva Contraseña"
              className="w-full p-3  border border-gray-200"
              {...register("password", {
                required: "La nueva contraseña es obligatorio",
                minLength: {
                  value: 8,
                  message: 'La contraseña debe tener al menos 8 caracteres'
                }
              })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>
          <div className="mb-5 space-y-3">
            <label
              htmlFor="password_confirmation"
              className="text-sm uppercase font-bold"
            >Repetir Contraseña</label>

            <input
              id="password_confirmation"
              type="password"
              placeholder="Repetir Contraseña"
              className="w-full p-3  border border-gray-200"
              {...register("passwordConfirmation", {
                required: "Este campo es obligatorio",
                validate: value => value === watch('password') || 'Las contraseñas deben coincidir'
              })}
            />
            {errors.passwordConfirmation && (
              <ErrorMessage>{errors.passwordConfirmation.message}</ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            value='Cambiar Contraseña'
            className="bg-amber-500 w-full p-3 text-white uppercase font-bold hover:bg-orange-400 rounded-lg cursor-pointer transition-colors"
          />
        </form>
      </div>
    </>
  )
}