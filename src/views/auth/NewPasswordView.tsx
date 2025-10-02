import { useState } from "react";
import NewPasswordForm from "../../components/auth/NewPasswordForm";
import NewPasswordToken from "../../components/auth/NewPasswordToken";
import type { UserConfirmAccountToken } from "../../types";
export default function NewPasswordView() {
  const [isValidToken, setIsValidToken] = useState(false);
  const [token, setToken] = useState<UserConfirmAccountToken["token"]>("");
  return (
    <>
      <h1 className="text-5xl font-black text-white ">
        Reestablecer Contraseña
      </h1>
      {!isValidToken ? (
        <p className="text-2xl font-light text-white mt-5">
          Introduce el código que recibiste por {""}
          <span className=" text-amber-500 font-bold"> email</span>
        </p>
      ) : (
        <p className="text-2xl font-light text-white mt-5">
          Introduce la nueva contraseña para  {""}
          <span className=" text-amber-500 font-bold"> reestablecerla</span>
        </p>
      )}
      {!isValidToken ? (
        <NewPasswordToken
          token={token}
          setToken={setToken}
          setIsValidToken={setIsValidToken}
        />
      ) : (
        <NewPasswordForm token={token} />
      )}
    </>
  );
}
