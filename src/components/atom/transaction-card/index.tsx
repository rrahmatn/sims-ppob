import React from "react";
import { Records } from "../../../types";

export const TransactionCard: React.FC<Records> = ({
  created_on,
  description,
  invoice_number,
  total_amount,
  transaction_type,
}) => {
  return (
    <div className="w-full flex flex-row justify-between border-2 bg-slate-50 border-black p-4 rounded-md shadow-lg">

      <span className="flex flex-col justify-evenly">
        <h3
          className={`text-xl font-semibold ${
            transaction_type === "TOPUP" ? "text-green-700" : "text-red-500"
          }`}
        >
          {" "}
          {transaction_type === "TOPUP" ? "+" : "-"} Rp. {total_amount}
        </h3>
        <p className="text-xs tracking-wider">{invoice_number}</p>
      </span>
      <span className="flex flex-col justify-evenly text-right">
        <p
          className={`text-sm ${
            transaction_type === "TOPUP" ? "text-green-600" : "text-red-800"
          }`}
        >
          {created_on.split('T')[0]  + ' - ' + created_on.split('T')[1].split('.')[0]}
        </p>
        <p className="text-xs tracking-wider">{description}</p>
      </span>
    </div>
  );
};
