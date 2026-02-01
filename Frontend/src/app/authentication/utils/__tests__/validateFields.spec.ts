import { CreateUser, Login } from "@/requests/interfaces/userInterface";
import { validateFields } from "../ValidateFields";

describe("Validate Fields", () => {
  describe("Create user", () => {
    const userDefault: CreateUser = {
      email: "user01@email.com",
      name: "user01",
      password: "User1234",
      passwordCheck: "User1234",
    };

    it("Should have an error if fields are empty", () => {
      const user: CreateUser = { email: "", name: "", password: "", passwordCheck: "" };

      const { hasError, fieldErrors } = validateFields.createUser(user);

      expect(hasError).toBe(true);
      expect(fieldErrors.email).toBe("Este campo é obrigatório");
      expect(fieldErrors.name).toBe("Este campo é obrigatório");
      expect(fieldErrors.password).toBe("Este campo é obrigatório");
      expect(fieldErrors.passwordCheck).toBe("Este campo é obrigatório");
    });

    it("Should have an error if email is invalid", () => {
      const user: CreateUser = { ...userDefault, email: "notValid" };

      const { hasError, fieldErrors } = validateFields.createUser(user);

      expect(hasError).toBe(true);
      expect(fieldErrors.email).toBe("Email invalido");
    });

    it("Should have an error if password is too short", () => {
      const user = { ...userDefault, password: "123" };

      const { hasError, fieldErrors } = validateFields.createUser(user);

      expect(hasError).toBe(true);
      expect(fieldErrors.password).toContain("Sua senha é muito curta");
    });

    it("Should have an error if password does not have a lowercase letter", () => {
      const user = { ...userDefault, password: "12345678" };

      const { hasError, fieldErrors } = validateFields.createUser(user);

      expect(hasError).toBe(true);
      expect(fieldErrors.password).toBe("A senha deve conter uma letra minúscula");
    });

    it("Should have an error if password does not have a uppercase letter", () => {
      const user = { ...userDefault, password: "user1234" };

      const { hasError, fieldErrors } = validateFields.createUser(user);

      expect(hasError).toBe(true);
      expect(fieldErrors.password).toBe("A senha deve conter uma letra maiúscula");
    });

    it("Should have an error if password does not have a number", () => {
      const user = { ...userDefault, password: "userUser" };

      const { hasError, fieldErrors } = validateFields.createUser(user);

      expect(hasError).toBe(true);
      expect(fieldErrors.password).toBe("A senha deve conter um número");
    });

    it("Should have an error if passwords are different", () => {
      const user = { ...userDefault, password: "User1234", passwordCheck: "Different" };

      const { hasError, fieldErrors } = validateFields.createUser(user);

      expect(hasError).toBe(true);
      expect(fieldErrors.passwordCheck).toBe("Suas senhas precisam ser iguais");
    });

    it("Should not have an error", () => {
      const { hasError, fieldErrors } = validateFields.createUser(userDefault);

      expect(hasError).toBe(false);
      expect(fieldErrors.email).toBe("");
      expect(fieldErrors.name).toBe("");
      expect(fieldErrors.password).toBe("");
      expect(fieldErrors.passwordCheck).toBe("");
    });
  });

  describe("Login", () => {
    it("Should have an error if email or password is empty", () => {
      const user: Login = { email: "", password: "" };

      const { hasError, fieldErrors } = validateFields.login(user);

      expect(hasError).toBe(true);
      expect(fieldErrors.email).toBe("Este campo é obrigatório");
      expect(fieldErrors.password).toBe("Este campo é obrigatório");
    });

    it("Should have an error if email is not valid", () => {
      const user: Login = { email: "notValid", password: "123" };

      const { hasError, fieldErrors } = validateFields.login(user);

      expect(hasError).toBe(true);
      expect(fieldErrors.email).toBe("Email invalido");
    });

    it("Should not have an error", () => {
      const user: Login = { email: "user01@email.com", password: "ok" };

      const { hasError, fieldErrors } = validateFields.login(user);

      expect(hasError).toBe(false);
      expect(fieldErrors.email).toBe("");
      expect(fieldErrors.password).toBe("");
    });
  });
});
