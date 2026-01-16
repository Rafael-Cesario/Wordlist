"use client";

import { useState } from "react";
import { CreateUser } from "./authentication/components/CreateUser";

export interface INotification {
  type: "error" | "success";
  message: string;
  open: boolean;
}

export default function Home() {
  const [activeForm, setActiveForm] = useState<"login" | "create">("login");

  return (
    <>
      <header className="flex justify-end p-5">
        <button className="text-neutral-400">Já tem uma conta? Entrar</button>
      </header>

      {activeForm === "create" && <CreateUser />}
    </>
  );
}

