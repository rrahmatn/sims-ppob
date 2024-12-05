import React from "react";

interface ConfirmationModalProps {
  onCancel: () => void;
  onSuccess: () => void;
  text: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onCancel,
  onSuccess,
  text,
}) => {
  return (
    <dialog
      id="confirmation_modal"
      className="modal modal-middle "
    >
      <div className="modal-box">
        <p className="py-4">{text}</p>
        <div className="modal-action flex flex-row w-full">
          <form method="dialog" className="w-1/3">
            <button
              onClick={onCancel}
              className="btn btn-error w-full text-white"
            >
              Batal
            </button>
          </form>
          <button
            onClick={onSuccess}
            className="btn btn-success w-1/3 text-white"
          >
            Lanjutkan
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmationModal;
