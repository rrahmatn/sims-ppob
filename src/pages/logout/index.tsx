import React, { useEffect } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { clearUserData } from "../../redux/reducer/user";
import { useDispatch } from "react-redux";

const LogoutPage: React.FC = () => {
  const navigate = useNavigate();

  const [cookies, setCookie, removeCookie] = useCookies(["access_token"]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (cookies.access_token !== "" || cookies.access_token !== null) {
      removeCookie("access_token");
      navigate("/auth");
      dispatch(clearUserData());
    }
  }, []);
  return (
    <>
      <div className="w-screen h-screen grid place-items-center bg-white">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    </>
  );
};

export default LogoutPage;
