import React, { useState } from "react";
import { FailedModal, Hero, Layout, SuccessModal } from "../../components";
import { AiFillDollarCircle } from "react-icons/ai";
import { TopUpList } from "../../constan";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const TopUpPage: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);
  const [nominal, setNominal] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);

  const topupHandler = useFormik({
    initialValues: {
      top_up_amount: nominal,
    },
    enableReinitialize: true,
    validationSchema: Yup.object({
      top_up_amount: Yup.number()
        .required("Nominal wajib diisi")
        .min(10000, "Nominal minimal adalah Rp.10.000")
        .max(1000000, "Nominal maksimal adalah Rp.1.000.000"),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(`${apiUrl}/topup`, values, {
          headers: {
            Authorization: `Bearer ${cookies.access_token}`,
          },
        });
        console.log(response);
        const successModal = document.getElementById(
          "success_modal"
        ) as HTMLDialogElement;
        successModal?.showModal();
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const failedModal = document.getElementById(
            "failed_modal"
          ) as HTMLDialogElement;
          failedModal?.showModal();
          console.log(error);

          if (
            error.response &&
            error.response.data &&
            error.response.data.message
          ) {
            setError(error.response.data.message);
          } else {
            setError("An unknown error occurred.");
          }
          console.error(error);
        } else {
          console.error("An unexpected error occurred", error);
          setError("An unexpected error occurred.");
        }
      }
    },
  });

  return (
    <>
      <Layout>
        <div className="w-full flex flex-col gap-2 md:gap-3 lg:gap-8">
          <Hero />
          <section className="w-full flex flex-col md:px-16 px-2 mt-3">
            <span className="flex flex-col mb-5 md:mb-10">
              <p className="">Silahkan masukan</p>
              <h3 className="text-xl font-semibold">Nominal Top Up</h3>
            </span>
            <div className="w-full flex flex-col md:flex-row md:items-center py-2 gap-3">
              <form
                onSubmit={topupHandler.handleSubmit}
                className="w-full md:w-1/2 flex flex-col gap-3 "
              >
                <div
                  className={`tooltip tooltip-error  ${
                    topupHandler.errors.top_up_amount ? "tooltip-open " : ""
                  }`}
                  data-tip={topupHandler.errors.top_up_amount}
                >
                  <span className="w-full bg-white flex flex-row items-center px-2 rounded-md shadow-lg py-1">
                    <label
                      htmlFor="top_up_amount"
                      className="grid w-1/12  place-items-center cursor-pointer"
                    >
                      <AiFillDollarCircle className="text-2xl" />
                    </label>
                    <input
                      name="top_up_amount"
                      id="top_up_amount"
                      type="number"
                      value={topupHandler.values.top_up_amount}
                      onChange={topupHandler.handleChange}
                      className="w-10/12 px-2 tracking-wide outline-none ring-0 border-0 active:ring-0 focus:ring-0 no-spinner"
                      placeholder="Nominal Top Up"
                      min={10000}
                      max={1000000}
                    />
                  </span>
                </div>

                <button
                  className={`w-full  text-white text-lg p-2 mt-1 rounded-sm shadow-md    ${
                    loading ||
                    !!topupHandler.errors.top_up_amount ||
                    !topupHandler.values.top_up_amount
                      ? "bg-slate-300"
                      : "bg-red-600 hover:bg-red-700"
                  }  `}
                  disabled={loading || !!topupHandler.errors.top_up_amount}
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Top Up"
                  )}
                </button>
              </form>
              <div className="w-full md:w-1/2 grid grid-cols-2 md:grid-cols-3 gap-3 my-5 md:my-0 ">
                {TopUpList.map((item, index) => (
                  <button
                    onClick={() => setNominal(item.nominal)}
                    type="button"
                    className="btn border-2 border-slate-300 bg-white p-2 shadow-md hover:bg-slate-200 hover:border-slate-500 active:bg-slate-600 active:text-white"
                    key={index}
                  >
                    <p>{item.tag}</p>
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        <SuccessModal
          onClose={() => {
            setError("");
            navigate("/");
          }}
        />
        <FailedModal
          onClose={() => {
            setError("");
            setLoading(false);
          }}
          message={error}
        />
      </Layout>
    </>
  );
};

export default TopUpPage;
