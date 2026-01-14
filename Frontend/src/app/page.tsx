import { TextInput } from "./components/TextInput";

export default function Home() {
  return (
    <>
      <header className="flex justify-end p-5">
        <button className="text-neutral-400">Já tem uma conta? Entrar</button>
      </header>

      <main className="flex flex-col mt-20">
        <h1 className="text-center text-3xl font-bold">Criar Conta</h1>
        <p className="text-center text-neutral-400">Preencha os dados abaixo para criar sua conta</p>

        <form className="flex flex-col items-center mt-8">
          <TextInput props={{ title: "Email", fieldName: "email", error: "Este email já esta em uso" }} />
          <TextInput props={{ title: "Nome", fieldName: "name", error: "Este email já esta em uso" }} />
          <TextInput props={{ title: "Senha", fieldName: "password", error: "Este email já esta em uso" }} />
          <TextInput
            props={{ title: "Confirmar Senha", fieldName: "passwordCheck", error: "Este email já esta em uso" }}
          />

          <button className="bg-royal-blue w-100 rounded-xs px-4 py-2 mt-4">Confirmar</button>
        </form>
      </main>
    </>
  );
}

