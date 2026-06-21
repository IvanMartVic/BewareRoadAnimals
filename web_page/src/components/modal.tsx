import { useEffect, useRef } from "react"
import { ModalResolver, ModalType } from "@/context/AlertContext";


// import { ModalResolver } from "@/context/AlertContext";
export default function ModalAlert({ isOpen, message, title, onClose, onConfirm, modalType }:
    { isOpen: boolean, message?: string, title?: string, onClose?: ModalResolver, onConfirm?: ModalResolver, modalType: ModalType }) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (isOpen) {
            dialogRef.current?.showModal();
        }
    }, [isOpen]);
    const handleClose = () => {
        dialogRef.current?.close();
        if (onClose) {
            onClose();
        }
    }
    const handleConfirm = () => {
        dialogRef.current?.close();
        if (onConfirm) {
            onConfirm(true);
        }
    }

    const modalActions = (modalType: ModalType) => {
        switch (modalType) {
            case "ALERT":
                return (
                    <button className="btn" onClick={handleClose}>Cerrar</button>
                );
            case "CONFIRM":
                return (
                    <>
                        <button className="btn" onClick={handleConfirm}>Aceptar</button>
                        <button className="btn" onClick={handleClose}>Cancelar</button>
                    </>
                )

        }

    }

    return (
        < dialog ref={dialogRef} className="modal" >
            <div className="modal-box">
                <h3 className="font-bold text-lg">{title || "Alerta"}</h3>
                <p className="py-4">{message}</p>
                <div className="modal-action">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        {
                            modalActions(modalType || "ALERT")
                        }
                    </form>
                </div>
            </div>
        </dialog >
    )

}
