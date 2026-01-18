import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { CreateUser } from "../CreateUser";
import { userRequests } from "@/requests/UserRequests";
import { USER_ERRORS } from "@/requests/errors/userErrors";

vi.mock("@/requests/userRequests", () => ({
  userRequests: {
    create: vi.fn().mockResolvedValue({
      data: { email: "user01@email.com", name: "user01", id: "1", createdAt: "20261001" },
      error: undefined,
    }),
  },
}));

describe("Create User Component", () => {
  const userDefault = { email: "user01@email.com", name: "user01", password: "User1234", passwordCheck: "User1234" };
  const user = userEvent.setup();

  const renderComponent = () => {
    const { getByPlaceholderText, getByRole } = render(<CreateUser />);

    const fields = {
      email: getByPlaceholderText("Email") as HTMLInputElement,
      name: getByPlaceholderText("Nome"),
      password: getByPlaceholderText("Senha"),
      passwordCheck: getByPlaceholderText("Confirmar Senha"),
    };

    const errors = {
      email: fields.email.nextSibling,
      name: fields.name.nextSibling,
      password: fields.password.parentElement?.nextSibling,
      passwordCheck: fields.passwordCheck.parentElement?.nextSibling,
    };

    const submitButton = getByRole("button", { name: "Confirmar" });

    return { fields, errors, submitButton };
  };

  it("Should change the value on the input", async () => {
    const { fields } = renderComponent();

    await user.type(fields.email, userDefault.email);
    await user.type(fields.name, userDefault.name);
    await user.type(fields.password, userDefault.password);
    await user.type(fields.passwordCheck, userDefault.passwordCheck);

    expect(fields.email.getAttribute("value")).toBe(userDefault.email);
    expect(fields.name.getAttribute("value")).toBe(userDefault.name);
    expect(fields.password.getAttribute("value")).toBe(userDefault.password);
    expect(fields.passwordCheck.getAttribute("value")).toBe(userDefault.passwordCheck);
  });

  it("Should display errors on the fields", async () => {
    const { fields, errors, submitButton } = renderComponent();

    await user.type(fields.email, "notValid");
    await user.type(fields.password, "user");
    await user.type(fields.passwordCheck, "1234");
    await user.click(submitButton);

    expect(errors.email?.textContent).toBe("Email invalido");
    expect(errors.name?.textContent).toBe("Este campo é obrigatório");
    expect(errors.password?.textContent).toBe("Sua senha é muito curta, mínimo 8 caracteres");
    expect(errors.passwordCheck?.textContent).toBe("Suas senhas precisam ser iguais");
  });

  it("Should remove all errors", async () => {
    const { fields, errors, submitButton } = renderComponent();

    await user.click(submitButton);

    await user.type(fields.email, userDefault.email);
    await user.type(fields.name, userDefault.name);
    await user.type(fields.password, userDefault.password);
    await user.type(fields.passwordCheck, userDefault.passwordCheck);

    await user.click(submitButton);

    expect(errors.email?.textContent).toBe("");
    expect(errors.name?.textContent).toBe("");
    expect(errors.password?.textContent).toBe("");
    expect(errors.passwordCheck?.textContent).toBe("");
  });

  it("Should show a notification with an error", async () => {
    const { fields, submitButton } = renderComponent();

    vi.mocked(userRequests.create).mockResolvedValueOnce({
      data: undefined,
      error: USER_ERRORS.U100,
    });

    await user.type(fields.email, userDefault.email);
    await user.type(fields.name, userDefault.name);
    await user.type(fields.password, userDefault.password);
    await user.type(fields.passwordCheck, userDefault.passwordCheck);
    await user.click(submitButton);

    const notification = screen.getByText("Este endereço de e-mail não está dispónivel");

    expect(notification).toBeInTheDocument();
    expect(notification.parentElement?.getAttribute("data-type")).toBe("error");
    expect(notification.parentElement?.className).toContain("border-red");
  });

  it("Should save user on localStorage", async () => {
    const { fields, submitButton } = renderComponent();

    await user.type(fields.email, userDefault.email);
    await user.type(fields.name, userDefault.name);
    await user.type(fields.password, userDefault.password);
    await user.type(fields.passwordCheck, userDefault.passwordCheck);
    await user.click(submitButton);

    const storage = localStorage.getItem("user");

    expect(storage).toBeDefined();
    expect(JSON.parse(storage!)).toHaveProperty("email", userDefault.email);
  });

  it("Should show a success notification", async () => {
    const { fields, submitButton } = renderComponent();

    await user.type(fields.email, userDefault.email);
    await user.type(fields.name, userDefault.name);
    await user.type(fields.password, userDefault.password);
    await user.type(fields.passwordCheck, userDefault.passwordCheck);
    await user.click(submitButton);

    const notification = screen.getByText("Sua conta foi criada com sucesso, você já pode entrar");

    expect(notification).toBeInTheDocument();
    expect(notification.parentElement?.getAttribute("data-type")).toBe("success");
    expect(notification.parentElement?.className).toContain("border-moss");
  });

  it("Should close the notification", async () => {
    const { fields, submitButton } = renderComponent();

    await user.type(fields.email, userDefault.email);
    await user.type(fields.name, userDefault.name);
    await user.type(fields.password, userDefault.password);
    await user.type(fields.passwordCheck, userDefault.passwordCheck);
    await user.click(submitButton);

    const notification = screen.getByText("Sua conta foi criada com sucesso, você já pode entrar");
    const closeNotificationButton = notification.nextSibling as HTMLButtonElement;

    await user.click(closeNotificationButton);

    expect(notification).not.toBeInTheDocument();
  });
});
