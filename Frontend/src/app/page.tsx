"use client";

import { useState } from "react";
import { TextInput } from "./authentication/components/TextInput";
import { produce } from "immer";
import { validateFields } from "./authentication/utils/ValidateFields";

export default function Home() {
  const defaultUser = { email: "", name: "", password: "", passwordCheck: "" };

  const [user, setUser] = useState(defaultUser);
  const [errors, setErrors] = useState(defaultUser);

  const createUser = () => {
    const { hasError, fieldErrors } = validateFields.createUser(user);
    if (hasError) return setErrors(fieldErrors);
  };

  const changeValue = (field: keyof typeof defaultUser, newValue: string) => {
    const newState = produce(user, (draft) => {
      draft[field] = newValue;
    });

    setUser(newState);
  };

  return (
    <>
      <header className="flex justify-end p-5">
        <button className="text-neutral-400">Já tem uma conta? Entrar</button>
      </header>

      <main className="flex flex-col mt-20">
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

          <TextInput
            props={{
              title: "Senha",
              fieldName: "password",
              error: errors.password,
              value: user.password,
              changeValue: (value) => changeValue("password", value),
            }}
          />

          <TextInput
            props={{
              title: "Confirmar Senha",
              fieldName: "passwordCheck",
              error: errors.passwordCheck,
              value: user.passwordCheck,
              changeValue: (value) => changeValue("passwordCheck", value),
            }}
          />

          <button className="bg-royal-blue w-100 rounded-xs px-4 py-2 mt-4 font-bold text-neutral-100">
            Confirmar
          </button>
        </form>
      </main>
    </>
  );
}

