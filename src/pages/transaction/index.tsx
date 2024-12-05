import React, { useEffect, useState } from "react";
import { Hero, Layout, TransactionCard } from "../../components";
import { Records } from "../../types";
import axios from "axios";
import { useCookies } from "react-cookie";

const TransactionPage: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [record, setRecord] = useState<Records[]>([]);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [hideButton, setHideButton] = useState<boolean>(false);
  const [cookies] = useCookies(["access_token"]);

  const getTransaction = async () => {
    try {
      const response = await axios.get(`${apiUrl}/transaction/history`, {
        params: {
          limit: 5,
          offset: page * 5,
        },
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });

      const payload = response.data.data;
      if (payload.records && payload.records.length > 0) {
        setRecord((prev) => [...prev, ...payload.records]);
      }

      if (payload.records.length === 0) {
        setHideButton(true);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    getTransaction();
  }, [page]);

  return (
    <Layout>
      <div className="w-full flex flex-col gap-2 md:gap-3 lg:gap-8">
        <Hero />
        <section className="w-full flex flex-col md:px-16 px-2 mt-1">
          <span className="flex flex-col mb-5 md:mb-10">
            <h3 className="text-xl font-semibold">Semua Transaksi</h3>
          </span>

          {record.length >= 1 ? (
            <div className="w-full flex flex-col gap-2">
              {record
                .filter(
                  (value, index, self) =>
                    index ===
                    self.findIndex(
                      (t) => t.invoice_number === value.invoice_number
                    )
                )
                .map((item, index) => (
                  <TransactionCard
                    created_on={item.created_on}
                    description={item.description}
                    invoice_number={item.invoice_number}
                    total_amount={item.total_amount}
                    transaction_type={item.transaction_type}
                    key={index}
                  />
                ))}
              {hideButton ? (
                <p className="text-sm font-semibold text-center py-7">Transaksi habis</p>
              ) : (
                <button
                  className="w-full btn my-4 shadow-lg"
                  onClick={() => {
                    setPage((prevPage) => prevPage + 1);
                  }}
                >
                  {!loading ? (
                    "Show More"
                  ) : (
                    <span className="loading loading-spinner loading-sm"></span>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="w-full h-40 grid place-items-center text-center">
              Tidak ada transaksi terdaftar
            </div>
          )}
        </section>
      </div>
    </Layout>
  );
};

export default TransactionPage;
