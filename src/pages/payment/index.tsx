import React, { useState, useEffect } from "react";
import { FailedModal, Hero, Layout, SuccessModal } from "../../components";
import { AiFillDollarCircle } from "react-icons/ai";
import { useFormik } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import axios from "axios";
import { useCookies } from "react-cookie";
import { clearPayment } from "../../redux/reducer/payment";

const PaymentPage: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const payments = useSelector((state: RootState) => state.payment);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);

  useEffect(() => {
    if (payments.service_tariff === 0) {
      navigate("/");
    }
  }, []);

  const transactionHandler = useFormik({
    initialValues: {
      top_up_amount: payments.service_tariff,
      service_code: payments.service_code,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${apiUrl}/transaction`,
          {
            service_code: values.service_code,
          },
          {
            headers: {
              Authorization: `Bearer ${cookies.access_token}`,
            },
          }
        );

        if (response.status === 200) {
          const successModal = document.getElementById(
            "success_modal"
          ) as HTMLDialogElement;
          successModal?.showModal();
        } else {
          throw error;
        }
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          const failedModal = document.getElementById(
            "failed_modal"
          ) as HTMLDialogElement;
          failedModal?.showModal();
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
            <span className="flex flex-col mb-5 md:mb-10 gap-3">
              <p className="">Pembayaran</p>
              <span className="w-full flex flex-row gap-3 items-center">
                <img
                  className="w-10 h-10 rounded-full shadow-lg border-[1px] border-black"
                  src={payments.service_icon}
                  alt={payments.service_name}
                />
                <h3 className="text-xl font-semibold">
                  {payments.service_name}
                </h3>
              </span>
            </span>
            <div className="w-full flex flex-col md:flex-row md:items-center py-2 gap-3">
              <form
                onSubmit={transactionHandler.handleSubmit}
                className="w-full  flex flex-col gap-3 "
              >
                <span className="w-full bg-white flex flex-row items-center px-2 rounded-md shadow-lg py-1 border-2 border-black">
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
                    value={transactionHandler.values.top_up_amount}
                    onChange={transactionHandler.handleChange}
                    className="w-10/12 px-2 tracking-wide outline-none ring-0 border-0 active:ring-0 focus:ring-0 no-spinner"
                    placeholder="Nominal Top Up"
                    min={10000}
                    max={1000000}
                    readOnly
                  />
                </span>
                <button
                  className={`w-full text-white text-lg p-2 mt-1 rounded-sm shadow-md ${
                    loading ||
                    !!transactionHandler.errors.top_up_amount ||
                    !transactionHandler.values.top_up_amount
                      ? "bg-slate-300"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                  disabled={
                    loading || !!transactionHandler.errors.top_up_amount
                  }
                >
                  {loading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    "Bayar"
                  )}
                </button>
              </form>
            </div>
          </section>
        </div>
        <SuccessModal
          onClose={() => {
            dispatch(clearPayment());
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

export default PaymentPage;
