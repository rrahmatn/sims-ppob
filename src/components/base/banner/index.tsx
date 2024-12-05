import React from "react";
import { Link } from "react-router-dom";

interface BannerProps {
  title: string;
  to: string;
  desc: string;
  img: string;
  sx : string
}

export const Banner: React.FC<BannerProps> = ({ title, to, desc, img , sx }) => {
  return (
    <Link
      to={to}
      className={`w-72 h-36  flex flex-col flex-shrink-0 gap-2  bg-white border border-gray-200 rounded-lg shadow  ${sx}`}
      style={{ backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
    <span className="my-auto  w-full h-full gap-2  py-4 px-2 md:px-4 md:py-8 flex flex-col justify-center text-white bg-black bg-opacity-35">
    <h2 className="text-base font-bold">{title}</h2>
      <p className="line-clamp-2 text-xs">{desc}</p>
      <p className="text-xs">Pelajari lebih lanjut</p>
    </span>
    </Link>
  );
};
