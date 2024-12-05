import React from "react";
import { ImCheckboxChecked } from "react-icons/im";

interface SuccessModalProps {
  onClose: () => void;
  text? : string
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ onClose  , text}) => {
  return (
    <>
      <dialog id="success_modal" className="modal">
        <div className="modal-box text-center">
          <span className="w-full flex justify-center items-center">
          <ImCheckboxChecked  className="text-[40px] text-green-500"/>
          </span>
          <p className="py-4">{text ?? 'Transaksi Berhasil'}</p>
        </div>
        <form method="dialog" onClick={onClose} className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
