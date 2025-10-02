import { PinInput, PinInputField } from "@chakra-ui/pin-input";
import { Link } from "react-router-dom";
import type { UserConfirmAccountToken } from "../../types";
import { useMutation } from "@tanstack/react-query";
import { checkToken } from "../../services/AuthService";
import { toast } from "react-toastify";
type NewPasswordTokenProps = {
  token: UserConfirmAccountToken["token"];
  setToken: React.Dispatch<React.SetStateAction<string>>;
  setIsValidToken: React.Dispatch<React.SetStateAction<boolean>>;
};
export default function NewPasswordToken({
  token,
  setToken,
  setIsValidToken,
}: NewPasswordTokenProps) {
  const pinInputFieldStules =
    "w-12 h-12 p-3 text-center text-2xl border-2 focus:border-amber-500  placeholder-white";

  const { mutate } = useMutation({
    mutationFn: checkToken,
    onError: (error: any) => {
      toast.error(error.message);
    },
    onSuccess: (data) => {
      setIsValidToken(true);
      toast.success(data);
    },
  });
  const handleChange = (token: UserConfirmAccountToken["token"]) => {
    setToken(token);
  };
  const handleComplete = (token: UserConfirmAccountToken["token"]) => {
    mutate({ token });
  };

  return (
    <>
      <form className="space-y-8 p-10 rounded-lg bg-slate-100 mt-10 ">
        <label className="font-normal text-2xl text-center block">
          Código de 6 dígitos
        </label>
        <div className="flex justify-center gap-5">
          <PinInput
            value={token}
            onChange={handleChange}
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
          to="/auth/forgot-password"
          className="text-center text-gray-300 font-normal"
        >
          Solicitar un nuevo <span className="text-amber-500">Código</span>
        </Link>
      </nav>
    </>
  );
}
