import { Link, useNavigate } from "react-router-dom";
import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { useState } from "react";
import type { UserConfirmAccountToken } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { confirmAccount } from "../../services/AuthService";
import { toast } from "react-toastify";
export default function ConfirmAccountView() {
  const pinInputFieldStules =
    "w-12 h-12 p-3 text-center text-2xl border-2 focus:border-amber-500  placeholder-white";
  const [token, setToken] = useState<UserConfirmAccountToken["token"]>("");
  const navigate = useNavigate();
  const { mutate } = useMutation({
    mutationFn: confirmAccount,
    onError: (error: Error) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data);
      navigate("/auth/login");
    },
  });
  const handleChange = (value: UserConfirmAccountToken["token"]) => {
    setToken(value);
  };
  const handleComplete = (value: UserConfirmAccountToken["token"]) => {
    mutate({ token: value });
  };
  return (
    <>
      <h1 className="text-4xl font-black text-white">Confirma tu Cuenta</h1>
      <p className="text-xl font-light text-white mt-5">
        Intorudce el código que recibiste por {""}
        <span className=" text-amber-500 font-bold">e-mail</span>
      </p>
      <form className="space-y-8 p-10 bg-slate-100 mt-10 rounded-lg">
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>
        <div className="flex justify-center gap-5">
          <PinInput
            onChange={handleChange}
            value={token}
            onComplete={handleComplete}
          >
            <PinInputField className={pinInputFieldStules} />
            <PinInputField className={pinInputFieldStules} />
            <PinInputField className={pinInputFieldStules} />
            <PinInputField className={pinInputFieldStules} />
            <PinInputField className={pinInputFieldStules} />
            <PinInputField className={pinInputFieldStules} />
          </PinInput>
        </div>
      </form>

      <nav className="mt-10 flex flex-col space-y-4">
        <Link
          to="/auth/request-confirmation-code"
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo Código
        </Link>
      </nav>
    </>
  );
}
