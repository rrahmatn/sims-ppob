import React, { useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { NavbarProps } from "../../../types";
import { NavItem } from "../../../constan";
import { useCookies } from "react-cookie";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "../../../redux/reducer/user";

export const Layout: React.FC<NavbarProps> = ({ children }) => {
  const apiUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [cookies ] = useCookies(["access_token"]);

  const getUser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/profile`, {
        headers: {
          Authorization: `Bearer ${cookies.access_token}`,
        },
      });
      const payload = response.data.data;
      dispatch(setUserData(payload))
      
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          navigate("/logout");
          alert('Sesi anda tela habis')
        }
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    if (!cookies.access_token) {
      navigate("/logout");
    }
    getUser();
  }, []);

  return (
    <>
      <div className="w-full max-w-screen-xl h-full min-h-screen mx-auto">
        <nav className="bg-white dark:bg-gray-900 px-2 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 shadow-lg">
          <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
            <Link
              to={"/"}
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <img
                src="/assets/images/Logo.png"
                className="h-8"
                alt="SIMS-PPOB Logo"
              />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
                SIMS-PPOB
              </span>
            </Link>
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <button
                data-collapse-toggle="navbar-sticky"
                type="button"
                className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                aria-controls="navbar-sticky"
                aria-expanded="false"
              >
                <span className="sr-only">Open main menu</span>
                <svg
                  className="w-5 h-5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 17 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M1 1h15M1 7h15M1 13h15"
                  />
                </svg>
              </button>
            </div>
            <div
              className="ml-auto px-2  items-center justify-between hidden w-full md:flex md:w-auto md:order-1"
              id="navbar-sticky"
            >
              <ul className="flex flex-col p-2 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                {NavItem.map((item, index) => (
                  <li key={index}>
                    <NavLink
                      to={item.link}
                      className="block py-2 px-2 text-black bg-blue-700 rounded md:bg-transparent md:p-0 "
                      aria-current="page"
                    >
                      {item.tag}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </nav>
        <div className="w-full h-full min-h-screen bg-white mx-auto pt-[70px] md:pt-16 ">
          {children}
        </div>
      </div>
    </>
  );
};
