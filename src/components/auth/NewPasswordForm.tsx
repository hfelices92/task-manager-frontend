import type { NewPasswordForm, UserConfirmAccountToken } from "../../types";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../components/ErrorMessage";
import { newPassword } from "../../services/AuthService";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
type NewPasswordFormProps = {
  token: UserConfirmAccountToken["token"];
};
export default function NewPasswordForm({ token }: NewPasswordFormProps) {
  const navigate = useNavigate();
  const initialValues: NewPasswordForm = {
    password: "",
    passwordConfirmation: "",
  };
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({ defaultValues: initialValues });
  const { mutate } = useMutation({
    mutationFn: newPassword,
    onError: (error: any) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      reset();
      navigate("/auth/login");
    },
  });

  const handleNewPassword = (formData: NewPasswordForm) => {
    const data = { formData, token };
    mutate(data);
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(handleNewPassword)}
        className="space-y-8 p-10  bg-white mt-10 sm-rounded-lg"
        noValidate
      >
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
          value="Establecer Password"
          className="bg-amber-500 hover:bg-orange-400 rounded-lg w-full p-3  text-white font-black  text-xl cursor-pointer"
        />
      </form>
    </>
  );
}
