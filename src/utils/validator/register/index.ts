import * as Yup from "yup";

export const RegisterValidator = Yup.object({
    email: Yup.string().email("Email tidak valid").required("Email wajib diisi"),
    first_name: Yup.string().required("Nama depan wajib diisi"),
    last_name: Yup.string().required("Nama belakang wajib diisi"),
    password: Yup.string().min(6, "Password minimal 6 karakter").required("Password wajib diisi"),
    confirm_password: Yup.string()
      .oneOf([Yup.ref("password")], "Konfirmasi password tidak cocok")
      .required("Konfirmasi password wajib diisi"),
  })