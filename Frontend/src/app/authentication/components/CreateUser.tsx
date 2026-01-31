"use client";

import { produce } from "immer";
import { useState } from "react";
import { validateFields } from "../utils/ValidateFields";
import { userRequests } from "@/requests/UserRequests";
import { TextInput } from "./TextInput";
import { PasswordInput } from "./PasswordInput";
import { INotification } from "./Notification";
import { Notification } from "./Notification";

export const CreateUser = () => {
  const defaultUser = { email: "", name: "", password: "", passwordCheck: "" };

  const [user, setUser] = useState(defaultUser);
  const [errors, setErrors] = useState(defaultUser);
  const [hidePassword, setHidePassword] = useState(true);
  const [notification, setNotification] = useState<INotification>({ message: "", type: "success", open: false });

  const createUser = async () => {
    const { hasError, fieldErrors } = validateFields.createUser(user);
    if (hasError) return setErrors(fieldErrors);

    setErrors(defaultUser);

    const { data, error } = await userRequests.create(user);

    if (error) {
      setNotification({ message: error, type: "error", open: true });
      return;
    }

    localStorage.setItem("user", JSON.stringify(data));

    setNotification({
      message: "Sua conta foi criada com sucesso, você já pode entrar",
      type: "success",
      open: true,
    });

    setUser(defaultUser);
  };

  const changeValue = (field: keyof typeof defaultUser, newValue: string) => {
    const newState = produce(user, (draft) => {
      draft[field] = newValue;
    });

    setUser(newState);
  };

  return (
    <main className="flex flex-col mt-20">
      <Notification props={{ notification, setNotification }} />

      <h1 className="text-center text-3xl font-bold">Criar Conta</h1>
      <p className="text-center text-neutral-400">Preencha os dados abaixo para criar sua conta</p>

      <form onSubmit={(e) => (e.preventDefault(), createUser())} className="flex flex-col items-center mt-8">
        <TextInput
          props={{
            title: "Email",
            fieldName: "email",
            error: errors.email,
            value: user.email,
            changeValue: (value) => changeValue("email", value),
          }}
        />

        <TextInput
          props={{
            title: "Nome",
            fieldName: "name",
            error: errors.name,
            value: user.name,
            changeValue: (value) => changeValue("name", value),
          }}
        />

        <PasswordInput
          props={{
            title: "Senha",
            fieldName: "password",
            error: errors.password,
            value: user.password,
            changeValue: (value) => changeValue("password", value),
            hidePassword,
            setHidePassword,
          }}
        />

        <PasswordInput
          props={{
            title: "Confirmar Senha",
            fieldName: "passwordCheck",
            error: errors.passwordCheck,
            value: user.passwordCheck,
            changeValue: (value) => changeValue("passwordCheck", value),
            hidePassword,
            setHidePassword,
          }}
        />

        <button className="bg-royal-blue w-100 rounded-xs px-4 py-2 mt-4 font-bold text-neutral-100">Confirmar</button>
      </form>
    </main>
  );
};
