"use client";

import { useState } from "react";
import { CreateUser } from "./authentication/components/CreateUser";
import { Login } from "./authentication/components/Login";

export interface INotification {
  type: "error" | "success";
  message: string;
  open: boolean;
}

export default function Home() {
  const [activeForm, setActiveForm] = useState<"login" | "create">("login");

  const changeForm = () => {
    setActiveForm(activeForm === "create" ? "login" : "create");
  };

  return (
    <>
      <header className="flex justify-end p-5">
        <button className="text-neutral-400" onClick={() => changeForm()}>
          {activeForm === "create" && "Entrar"}
          {activeForm === "login" && "Criar conta"}
        </button>
      </header>

      {activeForm === "login" && <Login />}
      {activeForm === "create" && <CreateUser />}
    </>
  );
}

