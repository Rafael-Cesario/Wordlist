import { CreateUser, Login } from "@/interfaces/userInterface";

// from Zod
const REGEX_EMAIL = /^(?!\.)(?!.*\.\.)([a-z0-9_'+\-\.]*)[a-z0-9_+-]@([a-z0-9][a-z0-9\-]*\.)+[a-z]{2,}$/i;

class ValidateFields {
  private email(email: string) {
    if (!email) return "Este campo é obrigatório";
    if (!REGEX_EMAIL.test(email)) return "Email invalido";

    return "";
  }

  private name(name: string) {
    if (!name) return "Este campo é obrigatório";
    return "";
  }

  private password(password: string) {
    if (!password) return "Este campo é obrigatório";
    if (password.length < 8) return "Sua senha é muito curta, mínimo 8 caracteres";
    if (!/[a-z]/.test(password)) return "A senha deve conter uma letra minúscula";
    if (!/[A-Z]/.test(password)) return "A senha deve conter uma letra maiúscula";
    if (!/[0-9]/.test(password)) return "A senha deve conter um número";
    return "";
  }

  private passwordCheck(passwordCheck: string, password: string) {
    if (!passwordCheck) return "Este campo é obrigatório";
    if (passwordCheck !== password) return "Suas senhas precisam ser iguais";
    return "";
  }

  private validateEmptyField = (field: string) => {
    if (!field) return "Este campo é obrigatório";
    return "";
  };

  private hasError = (errors: Record<string, string>) => {
    return Object.values(errors).some((value) => value.length > 0);
  };

  createUser(user: CreateUser) {
    const fieldErrors = {
      email: this.email(user.email),
      name: this.name(user.name),
      password: this.password(user.password),
      passwordCheck: this.passwordCheck(user.passwordCheck, user.password),
    };

    const hasError = this.hasError(fieldErrors);

    return { hasError, fieldErrors };
  }

  login(user: Login) {
    const fieldErrors = {
      email: this.email(user.email),
      password: this.validateEmptyField(user.password),
    };

    const hasError = this.hasError(fieldErrors);

    return { hasError, fieldErrors };
  }
}

export const validateFields = new ValidateFields();
