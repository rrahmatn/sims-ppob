import React, { useEffect, useState } from "react";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { useCookies } from "react-cookie";
import axios from "axios";

export const Hero: React.FC = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  const [showBalance, setShowBalance] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);
  const user = useSelector((state: RootState) => state.user);
  const img = useSelector((state: RootState) => state.user.profile_image);
  const [cookies ] = useCookies(["access_token"]);

  const getBalance = async () => {
    try {
      const response = await axios.get(`${apiUrl}/balance`, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
      const payload = response.data.data;
      setBalance(payload.balance);
    } catch (error) {
      console.log({ error });
    }
  };
  useEffect(() => {
    if (cookies.access_token) {
      getBalance();
    }
     // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full flex flex-col md:flex-row items-center py-2 shadow-sm rounded-md">
      <section className="w-full md:w-[60%] px-4 md:px-16 py-5 flex flex-col">
        <figure className=" grid place-items-center w-20 h-20 overflow-hidden bg-transparent border-2 border-black shadow-md rounded-full">
          <img
            className="w-full h-full m-auto"
            src={
              img.split("/")[4] !== "null"
                ? user.profile_image
                : "/assets/images/default-profile.png"
            }
            alt="Profile"
          />
        </figure>
        <p className="text-lg">Selamat Datang,</p>
        <h2 className="text-2xl font-bold capitalize">
          {user?.first_name} {user?.last_name}
        </h2>
      </section>
      <section className="w-full h-full md:w-[40%] p-2">
        <div className="w-full flex flex-col gap-2 p-3 text-white saldo-background rounded-md shadow-xl">
          <em className="text-base">Saldo anda</em>
          <h3 className="text-xl font-bold flex-inline">
            Rp.
            <input
              type={showBalance ? "text" : "password"}
              className="bg-transparent ring-0 outline-0 border-0 disabled text-xl w-52"
              value={balance}
              disabled
            />
          </h3>
          <button
            onClick={() => setShowBalance(!showBalance)}
            className="text-white flex flex-row w-full items-center gap-2 cursor-pointer"
          >
            Lihat saldo {!showBalance ? <IoMdEyeOff /> : <IoMdEye />}
          </button>
        </div>
      </section>
    </div>
  );
};
