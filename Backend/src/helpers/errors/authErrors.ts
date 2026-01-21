// tasks: refactor, separete code from message
export const AUTH_ERRORS = {
  invalidCredentials: { code: "A100", message: "Invalid credentials, the email or password provided are incorrect." },
  invalidSignature: { code: "A101", message: "Invalid signature" },
  tokenExpired: { code: "A102", message: "Token expired" },
  cookiesNotFound: { code: "A103", message: "Cookies not found" },
};
