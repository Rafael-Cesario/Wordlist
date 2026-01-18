import { render } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { PasswordInput } from "../PasswordInput";
import { useState } from "react";

const WrapperComponent = () => {
  const [hidePassword, setHidePassword] = useState(true);

  return (
    <PasswordInput
      props={{
        changeValue: vi.fn(),
        error: "",
        fieldName: "password",
        hidePassword,
        setHidePassword,
        title: "Senha",
        value: "",
      }}
    />
  );
};

describe("Password Input Component", () => {
  it("Show and hide the password", async () => {
    const user = userEvent.setup();
    const { getByRole, getByPlaceholderText } = render(<WrapperComponent />);

    const togglePasswordButton = getByRole("button");
    await user.click(togglePasswordButton);

    const passwordInput = getByPlaceholderText("Senha");
    expect(passwordInput.getAttribute("type")).toBe("text");

    await user.click(togglePasswordButton);
    expect(passwordInput.getAttribute("type")).toBe("password");
  });
});
