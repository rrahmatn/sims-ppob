import React from "react";
import { TiWarning } from "react-icons/ti";

interface FailedModalProps {
  onClose: () => void;
  message : string;
}

export const FailedModal: React.FC<FailedModalProps> = ({ onClose , message }) => {
  return (
    <>
      <dialog id="failed_modal" className="modal">
        <div className="modal-box text-center">
          <span className="w-full flex justify-center items-center">
          <TiWarning  className="text-[40px] text-red-500"/>
          </span>
          <p className="py-4">{ message}</p>
        </div>
        <form method="dialog" onClick={onClose} className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
