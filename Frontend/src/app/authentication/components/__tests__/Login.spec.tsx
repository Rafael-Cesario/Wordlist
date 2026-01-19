import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { render, screen } from "@testing-library/react";
import { Login } from "../Login";
import { authRequests } from "@/requests/AuthRequests";
import { AUTH_ERRORS } from "@/requests/errors/authErrors";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: pushMock,
    };
  },
}));

vi.mock("@/requests/AuthRequests", () => ({
  authRequests: {
    login: vi.fn().mockResolvedValue({
      data: "Success",
      error: undefined,
    }),
  },
}));

describe("Login Component", () => {
  const login = { email: "user01@email.com", password: "User1234" };
  const user = userEvent.setup();

  const renderComponent = () => {
    const { getByPlaceholderText, getByRole } = render(<Login />);

    const fields = {
      email: getByPlaceholderText("Email"),
      password: getByPlaceholderText("Senha"),
    };

    const errors = {
      email: fields.email.nextSibling,
      password: fields.password.parentElement?.nextSibling,
    };

    const submitButton = getByRole("button", { name: "Entrar" });

    return { fields, errors, submitButton };
  };

  it("Should change the value on the input", async () => {
    const { fields } = renderComponent();

    await user.type(fields.email, login.email);
    await user.type(fields.password, login.password);

    expect(fields.email.getAttribute("value")).toBe(login.email);
    expect(fields.password.getAttribute("value")).toBe(login.password);
  });

  it("Should have an error if email is not valid and password is empty", async () => {
    const { fields, errors, submitButton } = renderComponent();

    await user.type(fields.email, "notValid");
    await user.click(submitButton);

    expect(errors.email?.textContent).toBe("Email invalido");
    expect(errors.password?.textContent).toBe("Este campo é obrigatório");
  });

  it("Should clean all errors", async () => {
    const { fields, errors, submitButton } = renderComponent();

    await user.type(fields.email, "notValid");
    await user.click(submitButton);

    await user.type(fields.email, login.email);
    await user.type(fields.password, login.password);
    await user.click(submitButton);

    expect(errors.email?.textContent).toBe("");
    expect(errors.password?.textContent).toBe("");
  });

  it("Should show a notification with an error", async () => {
    const { fields, submitButton } = renderComponent();

    vi.mocked(authRequests.login).mockResolvedValueOnce({
      data: undefined,
      error: AUTH_ERRORS.A100,
    });

    await user.type(fields.email, login.email);
    await user.type(fields.password, login.password);
    await user.click(submitButton);

    const notification = screen.getByText(AUTH_ERRORS.A100);

    expect(notification).toBeInTheDocument();
    expect(notification.parentElement?.getAttribute("data-type")).toBe("error");
    expect(notification.parentElement?.className).toContain("border-red");
  });

  it("Should send user to home page after login", async () => {
    const { fields, submitButton } = renderComponent();

    await user.type(fields.email, login.email);
    await user.type(fields.password, login.password);
    await user.click(submitButton);

    expect(pushMock).toHaveBeenCalledWith("/home");
  });
});
