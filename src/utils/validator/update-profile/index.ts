import * as Yup from "yup";

export const UpdateProfileValidator = Yup.object({
    first_name: Yup.string().required("Nama depan wajib diisi"),
    last_name: Yup.string().required("Nama belakang wajib diisi"),
  })