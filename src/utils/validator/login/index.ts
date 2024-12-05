import * as Yup from "yup";
export const LoginValidator = Yup.object({
  email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
  password: Yup.string().required("Password wajib diisi"),
});
