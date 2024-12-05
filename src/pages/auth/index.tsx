import { useEffect, useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaUserAlt } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import { FaLockOpen } from "react-icons/fa";
import { PiPasswordFill } from "react-icons/pi";
import { useFormik } from "formik";
import { LoginValidator, RegisterValidator } from "../../utils/validator";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

const AuthPage = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showPassword2, setShowPassword2] = useState<boolean>(false);
  const [showPassword3, setShowPassword3] = useState<boolean>(false);
  const [login, setLogin] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<boolean>(false);
  const [registerError, setRegisterError] = useState<string>("");
  const [registerMessage, setRegisterMessage] = useState<string>("");


  const [cookies, setCookie] = useCookies(["access_token"]);

  useEffect(() => {
    if (cookies.access_token !== "" && cookies.access_token) {
      console.log(cookies.access_token);
      navigate("/");
    } 
  }, []);

  const loginHandler = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginValidator,
    onSubmit: async (values) => {
      setLoading(true);
      setLoginError(false);
      setRegisterMessage("");

      try {
        const response = await axios
          .post(`${apiUrl}/login`, values)
          .then((e) => {
            setCookie("access_token", e.data.data.token);
            setLoading(false);
            navigate("/");
            return e;
          });

        return response.data;
      } catch (error) {
        loginHandler.resetForm();
        setLoginError(true);
        setLoading(false);
      }
    },
  });

  const registerHandler = useFormik({
    initialValues: {
      email: "",
      first_name: "",
      last_name: "",
      password: "",
      confirm_password: "",
    },
    validationSchema: RegisterValidator,
    onSubmit: async (values) => {
      setLoading(true);
      setRegisterError("");
      try {
        const response = await axios.post(`${apiUrl}/registration`, values);

        setRegisterMessage(response.data.message);
        setLogin(true);
        setLoading(false);
        console.log(response);
        return response.data;
      } catch (error) {
        console.log(error);
        if (axios.isAxiosError(error)) {
          console.log("Error response: ", error.response);
          setRegisterError(error.response?.data?.message || "Error");
        } else {
          console.error("Unexpected error:", error);
        }
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    const errorMessage = [];
    if (registerHandler.errors.email) {
      errorMessage.push(registerHandler.errors.email);
    }
    if (
      registerHandler.errors.confirm_password &&
      registerHandler.values.confirm_password !== ""
    ) {
      errorMessage.push(registerHandler.errors.confirm_password);
    }
    if (errorMessage.length > 0) {
      setRegisterError(errorMessage.join(", "));
    } else {
      setRegisterError("");
    }
  }, [registerHandler.errors, registerHandler.values.confirm_password]);

  const containerVariants = {
    initial: {
      opacity: 0,
      scale: 0.7,
    },
    animate: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.7, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      scale: 1.2,
      transition: { duration: 0.7, ease: "easeInOut" },
    },
  };

  const contentVariants = {
    initial: {
      x: -500,
    },
    animate: {
      x: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    exit: {
      x: 200,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
  };

  return (
    <div className="w-screen h-screen  grid place-items-center">
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className={`flex w-11/12 md:w-5/6 max-w-screen-lg my-auto h-fit mx-auto justify-center bg-[#f6f6f7] shadow-xl rounded-lg ${
          login ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <section
          className={`w-full md:w-1/2 h-full flex flex-col mx-auto my-auto  ${
            login ? "px-4 md:px-16 gap-1" : " px-4 md:px-16 gap-1"
          }   transition-all duration-1000`}
        >
          <span className="flex flex-row items-center gap-2 my-4 mx-auto">
            <img src="/assets/images/Logo.png" alt="Logo" />
            <h2 className="text-2xl font-bold ">SIMS PPOB</h2>
          </span>
          {login ? (
            <>
              <h4
                className={`md:text-lg text-sm font-semibold  text-center ${
                  loginError || registerMessage !== "" ? "mb-3" : "mb-12"
                }`}
              >
                Masuk atau buat akun untuk memulai
              </h4>
              <form
                className={`flex flex-col w-full h-full gap-2 md:gap-3`}
                onSubmit={loginHandler.handleSubmit}
              >
                {registerMessage !== "" ? (
                  <div className="alert alert-success">
                    <span className="text-xs text-white">
                      {registerMessage}
                    </span>
                  </div>
                ) : null}
                {loginError ? (
                  <div className="alert alert-error">
                    <span className="text-xs text-white">
                      Email dan Password tidak cocokk!
                    </span>
                  </div>
                ) : null}
                <span className="w-full bg-white flex flex-row items-center px-2 rounded-md shadow-md py-1">
                  <label
                    htmlFor="email"
                    className="grid w-1/12  place-items-center cursor-pointer"
                  >
                    <MdEmail className="text-2xl" />
                  </label>
                  <input
                    name="email"
                    id="email"
                    type="text"
                    className="w-10/12 px-2  bg-transparent tracking-wide outline-none ring-0 border-0 active:ring-0 focus:ring-0"
                    placeholder="Email"
                    value={loginHandler.values.email}
                    onChange={loginHandler.handleChange}
                  />
                </span>
                <span className="w-full bg-white flex flex-row items-center px-2 rounded-md shadow-md py-1">
                  <label
                    htmlFor="password"
                    className="grid w-1/12  place-items-center cursor-pointer"
                  >
                    <PiPasswordFill className="text-2xl" />
                  </label>
                  <input
                    name="password"
                    id="password"
                    type={!showPassword ? "password" : "text"}
                    className="w-10/12 px-2  bg-transparent tracking-wide outline-none ring-0 border-0 active:ring-0 focus:ring-0"
                    placeholder="Password"
                    value={loginHandler.values.password}
                    onChange={loginHandler.handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseLeave={() => setShowPassword(false)}
                    className="grid w-1/12  place-items-center cursor-pointer"
                    tabIndex={-1}
                  >
                    {!showPassword ? <FaLock /> : <FaLockOpen />}
                  </button>
                </span>
                <button
                  className={`w-full  text-white text-lg p-2 mt-1 rounded-sm shadow-md    ${
                    loading ? "bg-slate-300" : "bg-red-600 hover:bg-red-700"
                  }  `}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Masuk"
                  )}
                </button>
              </form>
              <span className="text-sm inline-flex gap-1 md:mb-0 md:mt-2 mb-5 mt-5">
                Belum punya akun? registrasi{" "}
                <button
                  onClick={() => {
                    loginHandler.resetForm();
                    registerHandler.resetForm();
                    setLogin(false);
                    setRegisterError("");
                    setRegisterMessage("");
                    setLoginError(false);
                    setShowPassword(false);
                    setShowPassword2(false);
                    setShowPassword3(false);
                  }}
                  className="text-blue-600"
                  disabled={loading}
                >
                  disini
                </button>
              </span>
            </>
          ) : (
            <>
              <h4
                className={`md:text-lg text-sm font-semibold text-center ${
                  registerError === "" ? "mb-3" : ""
                }`}
              >
                Lengkapi data untuk membuat akun
              </h4>
              {registerError !== "" ? (
                <div className="alert alert-error">
                  <span className="text-xs text-white">{registerError}</span>
                </div>
              ) : null}
              <form
                className={`flex flex-col w-full h-full  ${
                  registerError === ""
                    ? "mb-7  gap-2 md:gap-3"
                    : "md:gap-3 gap-1"
                } transition-all duration-500`}
                onSubmit={registerHandler.handleSubmit}
              >
                <span className="w-full bg-white flex flex-row items-center px-2 rounded-md shadow-md py-1">
                  <label
                    htmlFor="email"
                    className="grid w-1/12  place-items-center cursor-pointer"
                  >
                    <MdEmail className="text-2xl" />
                  </label>
                  <input
                    name="email"
                    id="email"
                    type="text"
                    className="w-10/12 px-2  bg-transparent tracking-wide outline-none ring-0 border-0 active:ring-0 focus:ring-0 focus:bg-transparent"
                    placeholder="Email"
                    value={registerHandler.values.email}
                    onChange={registerHandler.handleChange}
                  />
                </span>
                <span className="w-full bg-white flex flex-row items-center px-2 rounded-md shadow-md py-1">
                  <label
                    htmlFor="first_name"
                    className="grid w-1/12  place-items-center cursor-pointer"
                  >
                    <FaUserAlt className="text-2xl" />
                  </label>
                  <input
                    name="first_name"
                    id="first_name"
                    type="text"
                    className="w-10/12 bg-transparent  px-2 tracking-wide outline-none ring-0 border-0 active:ring-0 focus:ring-0"
                    placeholder="Nama depan"
                    value={registerHandler.values.first_name}
                    onChange={registerHandler.handleChange}
                  />
                </span>
                <span className="w-full bg-white flex flex-row items-center px-2 rounded-md shadow-md py-1">
                  <label
                    htmlFor="last_name"
                    className="grid w-1/12  place-items-center cursor-pointer"
                  >
                    <FaUserAlt className="text-2xl" />
                  </label>
                  <input
                    name="last_name"
                    id="last_name"
                    type="text"
                    className="w-10/12 bg-transparent px-2 tracking-wide outline-none ring-0 border-0 active:ring-0 focus:ring-0"
                    placeholder="Nama belakang"
                    value={registerHandler.values.last_name}
                    onChange={registerHandler.handleChange}
                  />
                </span>
                <span className="w-full bg-white flex flex-row items-center px-2 rounded-md shadow-md py-1">
                  <label
                    htmlFor="password"
                    className="grid w-1/12  place-items-center cursor-pointer"
                  >
                    <PiPasswordFill className="text-2xl" />
                  </label>
                  <input
                    name="password"
                    id="password"
                    type={!showPassword2 ? "password" : "text"}
                    className="w-10/12 bg-transparent px-2 tracking-wide outline-none ring-0 border-0 active:ring-0 focus:ring-0"
                    placeholder="Password"
                    value={registerHandler.values.password}
                    onChange={registerHandler.handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword2(!showPassword2)}
                    onMouseLeave={() => setShowPassword2(false)}
                    className="grid w-1/12  place-items-center cursor-pointer"
                    tabIndex={-1}
                  >
                    {!showPassword2 ? <FaLock /> : <FaLockOpen />}
                  </button>
                </span>
                <span className="w-full bg-white flex flex-row items-center px-2 rounded-md shadow-md py-1">
                  <label
                    htmlFor="confirm_password"
                    className="grid w-1/12  place-items-center cursor-pointer"
                  >
                    <PiPasswordFill className="text-2xl" />
                  </label>
                  <input
                    name="confirm_password"
                    id="confirm_password"
                    type={!showPassword3 ? "password" : "text"}
                    className="w-10/12 px-2 tracking-wide outline-none ring-0 border-0 active:ring-0 focus:ring-0"
                    placeholder="Konfirmasi password"
                    value={registerHandler.values.confirm_password}
                    onChange={registerHandler.handleChange}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword3(!showPassword3)}
                    onMouseLeave={() => setShowPassword3(false)}
                    className="grid w-1/12  place-items-center cursor-pointer"
                    tabIndex={-1}
                  >
                    {!showPassword3 ? <FaLock /> : <FaLockOpen />}
                  </button>
                </span>
                <button
                  className={`w-full text-white text-lg p-2 mt-1 rounded-sm shadow-md ${
                    loading || Object.keys(registerHandler.errors).length > 0
                      ? "bg-slate-300 cursor-not-allowed"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  disabled={
                    loading || Object.keys(registerHandler.errors).length > 0
                  }
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Daftar"
                  )}
                </button>
              </form>
              <span className="text-sm inline-flex gap-1 md:mb-0 md:mt-2 mb-5 mt-5">
                Sudah punya akun? masuk
                <button
                  onClick={() => {
                    loginHandler.resetForm();
                    registerHandler.resetForm();
                    setLogin(true);
                    setRegisterError("");
                    setRegisterMessage("");
                    setLoginError(false);
                    setShowPassword(false);
                    setShowPassword2(false);
                    setShowPassword3(false);
                  }}
                  className="text-blue-600"
                  disabled={loading}
                >
                  disini
                </button>
              </span>
            </>
          )}
        </section>
        <motion.figure
          className={`hidden md:flex relative h-full my-auto md:w-1/2 overflow-hidden rounded-lg transition duration-1000 ease-in`}
          variants={contentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <img
            className={`h-full my-auto`}
            src="/assets/images/login.png"
            alt="Login"
            loading="lazy"
          />
        </motion.figure>
      </motion.div>
    </div>
  );
};

export default AuthPage;
