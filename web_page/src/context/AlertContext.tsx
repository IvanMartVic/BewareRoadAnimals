"use client"
import React, { useContext, useRef } from "react";
import { createContext, useState } from "react";
import ModalAlert from "@/components/modal";
interface ModalContext {
    showAlert: (data: { message: string, title: string }) => Promise<void>;
    showConfirm: (data: { message: string, title: string }) => Promise<boolean>;
}

const ModalContext = createContext<ModalContext | undefined>(undefined);
export type ModalResolver = (choice?: boolean) => void | boolean;
export type ModalType = "ALERT" | "CONFIRM";

export const ModalProvider = ({ children }: { children: React.ReactNode }) => {
    const [modalType, setModalType] = useState<ModalType>("ALERT");
    const [state, setState] = useState({ isOpen: false });
    const fn = useRef<ModalResolver | undefined>(undefined);
    const showAlert = (data: { message: string }) => {
        setModalType("ALERT");
        return new Promise<void>((resolve) => {
            setState({ ...data, isOpen: true });
            fn.current = () => {
                resolve();
                setState({ isOpen: false });
            };
        })
    }
    const showConfirm = (data: { message: string }) => {
        setModalType("CONFIRM");
        return new Promise<boolean>((resolve) => {
            setState({ ...data, isOpen: true });
            fn.current = (choice?: boolean) => {
                resolve(choice || false);
                setState({ isOpen: false });
            };
        })
    }

    return (
        <ModalContext.Provider value={{ showAlert: showAlert, showConfirm: showConfirm }}>
            <ModalAlert {...state} onClose={fn.current} onConfirm={fn.current} modalType={modalType} />
            {children}
        </ModalContext.Provider>
    )

}

export function useModal() {
    return useContext(ModalContext);
}
