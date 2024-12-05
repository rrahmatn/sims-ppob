import React, { useEffect, useState } from "react";
import { Layout, SuccessModal } from "../../components";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { MdEmail } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { useFormik } from "formik";
import { UpdateProfileValidator } from "../../utils/validator";
import { Link, useNavigate } from "react-router-dom";
import { MdEditSquare } from "react-icons/md";
import * as Yup from "yup";
import ConfirmationModal from "../../components/atom/confirmation-modal";

const ProfilePage: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string>("");
  const [updateMessage, setUpdateMessage] = useState<string>("");

  const user = useSelector((state: RootState) => state.user);
  const img = useSelector((state: RootState) => state.user.profile_image);
  const [cookies] = useCookies(["access_token"]);

  useEffect(() => {
    if (user.email === "") {
      navigate("/");
    }
     // eslint-disable-next-line
  }, []);

  const updateProfileHandler = useFormik({
    initialValues: {
      first_name: user.first_name,
      last_name: user.last_name,
    },
    validationSchema: UpdateProfileValidator,
    onSubmit: async (values) => {
      setLoading(true);
      setUpdateError("");
      try {
        const response = await axios.put(`${apiUrl}/profile/update`, values, {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        setUpdateMessage(response.data.message);
        setLoading(false);
        const conf = document.getElementById(
          "success_modal"
        ) as HTMLDialogElement;
        conf.showModal();
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            navigate("/logout");
            alert("Sesi anda telah habis");
          } else {
            setUpdateError(error.response?.data?.message || "Error");
          }
        } else {
          console.error("Unexpected error:", error);
        }
        setLoading(false);
      }
    },
  });

  const updateImageHandler = useFormik({
    initialValues: {
      profile_image: null as File | null,
    },
    validationSchema: Yup.object({
      profile_image: Yup.mixed()
        .required("Gambar wajib diunggah")
        .test(
          "fileFormat",
          "Hanya file PNG atau JPEG yang diterima",
          (value) => {
            return (
              value &&
              value instanceof File &&
              (value.type === "image/png" || value.type === "image/jpeg")
            );
          }
        )
        .test("fileSize", "Ukuran file terlalu besar (max 100KB)", (value) => {
          return value && value instanceof File && value.size <= 100 * 1024; //
        }),
    }),
    onSubmit: async (values) => {
      if (!values.profile_image) return;

      const formData = new FormData();
      formData.append("file", values.profile_image);

      setLoading(true);
      setUpdateError("");
      try {
        const response = await axios.put(`${apiUrl}/profile/image`, formData, {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setUpdateMessage(response.data.message);
        setLoading(false);
        const conf = document.getElementById(
          "success_modal"
        ) as HTMLDialogElement;
        conf.showModal();
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            navigate("/logout");
            alert("Sesi anda telah habis");
          } else {
            setUpdateError(error.response?.data?.message || "Error");
          }
        } else {
          console.error("Unexpected error:", error);
        }
        setLoading(false);
      }
    },
  });

  return (
    <>
      <Layout>
        <div className="w-full flex flex-col mx-auto items-center">
          <div className="flex flex-col gap-4 p-2 md:p-4 items-center">
            <form
              className=" grid place-items-center w-40 h-40 overflow-hidden bg-transparent border-2 border-black shadow-md rounded-full"
              onSubmit={updateImageHandler.handleSubmit}
            >
              <img
                className="w-full h-full m-auto"
                src={
                  img.split("/")[4] !== "null"
                    ? user.profile_image
                    : "/assets/images/default-profile.png"
                }
                alt="Profile"
              />

              <label
                htmlFor="file-upload"
                className="absolute z-[10] text-3xl mx-auto ml-28 mt-28 bg-opacity-15 rounded-full bg-black cursor-pointer"
              >
                {" "}
                <MdEditSquare />
              </label>
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={async (e) => {
                  const file = e.target.files ? e.target.files[0] : null;
                  if (file) {
                    await updateImageHandler.setFieldValue(
                      "profile_image",
                      file
                    );
                    updateImageHandler.handleSubmit();
                  }
                }}
              />
            </form>

            {updateImageHandler.errors.profile_image &&
              updateImageHandler.touched.profile_image && (
                <div className="text-red-500 text-sm">
                  {updateImageHandler.errors.profile_image}
                </div>
              )}
            <h3 className="text-md font-bold">
              {user.first_name + " " + user.last_name}
            </h3>
          </div>
          <form
            className={`flex flex-col w-full max-w-screen-md my-4 px-4 h-full  ${
              updateError === "" ? "mb-3  gap-2 md:gap-3" : "md:gap-3 gap-1"
            } transition-all duration-500`}
            onSubmit={updateProfileHandler.handleSubmit}
          >
            <label
              htmlFor="email"
              className="w-full px-2 tex-lg cursor-pointer mt-1 font-medium"
            >
              Email :
            </label>
            <span className="w-full bg-white flex flex-row items-center px-2 rounded-md shadow-md py-1">
              <label
                htmlFor="email"
                className="grid w-1/12 place-items-center cursor-pointer"
              >
                <MdEmail className="text-2xl" />
              </label>
              <input
                id="email"
                type="text"
                className="w-10/12 px-2 bg-transparent tracking-wide outline-none ring-0 border-0 active:ring-0 focus:ring-0 focus:bg-transparent"
                placeholder="Email"
                value={user.email}
                readOnly
              />
            </span>
            <label
              htmlFor="first_name"
              className="w-full px-2 tex-lg cursor-pointer mt-1 font-medium"
            >
              Nama Depan :
            </label>
            <span className="w-full bg-white flex flex-row items-center px-2 rounded-md shadow-md py-1">
              <label
                htmlFor="first_name"
                className="grid w-1/12 place-items-center cursor-pointer"
              >
                <FaUserAlt className="text-2xl" />
              </label>
              <input
                name="first_name"
                id="first_name"
                type="text"
                className="w-10/12 bg-transparent  px-2 tracking-wide outline-none ring-0 border-0 active:ring-0 focus:ring-0"
                placeholder="Nama depan"
                value={updateProfileHandler.values.first_name}
                onChange={updateProfileHandler.handleChange}
              />
            </span>

            <label
              htmlFor="last_name"
              className="w-full px-2 tex-lg cursor-pointer mt-1 font-medium"
            >
              Nama belakang :
            </label>
            <span className="w-full bg-white flex flex-row items-center px-2 rounded-md shadow-md py-1">
              <label
                htmlFor="last_name"
                className="grid w-1/12 place-items-center cursor-pointer"
              >
                <FaUserAlt className="text-2xl" />
              </label>
              <input
                name="last_name"
                id="last_name"
                type="text"
                className="w-10/12 bg-transparent px-2 tracking-wide outline-none ring-0 border-0 active:ring-0 focus:ring-0"
                placeholder="Nama belakang"
                value={updateProfileHandler.values.last_name}
                onChange={updateProfileHandler.handleChange}
              />
            </span>
            <button
              type="button"
              onClick={() => {
                const conf = document.getElementById(
                  "confirmation_modal"
                ) as HTMLDialogElement;
                conf.showModal();
              }}
              className={`w-full text-black border-2 border-black text-lg p-2 mt-1 rounded-md shadow-md ${
                loading || Object.keys(updateProfileHandler.errors).length > 0
                  ? "bg-slate-300 cursor-not-allowed"
                  : "bg-slate-50 hover:bg-slate-200"
              }`}
              disabled={
                loading || Object.keys(updateProfileHandler.errors).length > 0
              }
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Edit Profile"
              )}
            </button>
            <Link
              to={"/logout"}
              className={`w-full text-center text-white bg-red-600 text-lg p-2 mt-1 rounded-md shadow-md `}
            >
              {loading ? (
                <span className="loading loading-spinner loading-sm"></span>
              ) : (
                "Logout"
              )}
            </Link>
          </form>
          <ConfirmationModal
            text="Anda yakin ingin mengubah data anda ?"
            onCancel={() => {}}
            onSuccess={() => {
              updateProfileHandler.handleSubmit();
              const conf = document.getElementById(
                "confirmation_modal"
              ) as HTMLDialogElement;
              conf.close();
            }}
          />
          <SuccessModal
            onClose={() => {
              navigate("/");
            }}
            text={updateMessage}
          />
        </div>
      </Layout>
    </>
  );
};

export default ProfilePage;
