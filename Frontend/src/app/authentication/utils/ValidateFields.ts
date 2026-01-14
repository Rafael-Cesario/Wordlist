interface CreateUser {
  email: string;
  name: string;
  password: string;
  passwordCheck: string;
}

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
    return "";
  }

  private passwordCheck(passwordCheck: string) {
    if (!passwordCheck) return "Este campo é obrigatório";
    return "";
  }

  createUser(user: CreateUser) {
    const fieldErrors = {
      email: this.email(user.email),
      name: this.name(user.name),
      password: this.password(user.password),
      passwordCheck: this.passwordCheck(user.passwordCheck),
    };

    const hasError = Object.values(fieldErrors).some((value) => value.length > 0);

    return { hasError, fieldErrors };
  }
}

export const validateFields = new ValidateFields();
