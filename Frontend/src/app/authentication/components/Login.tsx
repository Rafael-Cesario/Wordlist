"use client";

import { useState } from "react";
import { TextInput } from "./TextInput";
import { produce } from "immer";
import { PasswordInput } from "./PasswordInput";
import { validateFields } from "../utils/ValidateFields";
import { authRequests } from "@/requests/AuthRequests";
import { Notification } from "./Notification";
import { INotification } from "./Notification";
import { useRouter } from "next/navigation";

export const Login = () => {
  const defaultUser = { email: "", password: "" };
  const router = useRouter();

  const [user, setUser] = useState(defaultUser);
  const [errors, setErrors] = useState(defaultUser);
  const [hidePassword, setHidePassword] = useState(true);
  const [notification, setNotification] = useState<INotification>({ message: "", type: "success", open: false });

  const changeValue = (field: keyof typeof defaultUser, value: string) => {
    const state = produce(user, (draft) => {
      draft[field] = value;
    });

    setUser(state);
  };

  const login = async () => {
    const { hasError, fieldErrors } = validateFields.login(user);
    if (hasError) return setErrors(fieldErrors);

    setErrors(defaultUser);

    const { error } = await authRequests.login(user);

    if (error) {
      setNotification({ type: "error", open: true, message: error });
      return;
    }

    router.push("/home");
  };

  return (
    <main className="flex flex-col mt-20">
      <Notification props={{ notification, setNotification }} />

      <h1 className="text-center text-3xl font-bold">Entrar</h1>
      <p className="text-center text-neutral-400">Preencha seus dados para entrar</p>

      <form onSubmit={(e) => (e.preventDefault(), login())} className="flex flex-col items-center mt-8">
        <TextInput
          props={{
            changeValue: (value) => changeValue("email", value),
            fieldName: "email",
            title: "Email",
            value: user.email,
            error: errors.email,
          }}
        />

        <PasswordInput
          props={{
            changeValue: (value) => changeValue("password", value),
            error: errors.password,
            fieldName: "password",
            hidePassword,
            setHidePassword,
            title: "Senha",
            value: user.password,
          }}
        />

        <button className="bg-royal-blue w-100 rounded-xs px-4 py-2 mt-4 font-bold text-neutral-100">Entrar</button>
      </form>
    </main>
  );
};
