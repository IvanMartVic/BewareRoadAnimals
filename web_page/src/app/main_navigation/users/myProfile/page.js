"use client"
import avatar from "@/../public/avatar.jpg"
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import useAuthStore from "@/stores/authStore"
import { useShallow } from "zustand/shallow";
import useUserStore from "@/stores/userStore"
import { useRouter } from "next/navigation";
import EmailInput from "@/components/emailInput";
import NombreApellidosInput from "@/components/nombreApellidosInput";

export default function MyProfilePage() {
    const [name_disabled, set_name_disabled] = useState(true);
    const [email_disabled, set_email_disabled] = useState(true);
    const router = useRouter();
    const { authUserData, fetchAuthUser, setAuthUserData, updateAuthUser, deleteAuthUser } = useAuthStore(
        useShallow((state) => ({
            authUserData: state.authUserData,
            fetchAuthUser: state.fetchAuthUser,
            setAuthUserData: state.setAuthUserData,
            updateAuthUser: state.updateAuthUser,
            deleteAuthUser: state.deleteAuthUser,
        }))
    );

    useEffect(() => {
        fetchAuthUser();
    }, [fetchAuthUser]);

    const handleChanges = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (authUserData) {
            const new_data = { full_name: authUserData?.full_name, email: authUserData?.email }
            await updateAuthUser(new_data);
        }
        alert("información cambiada con éxito");
        router.push("/main_navigation")
    }
    const deleteUser = async () => {
        const c = confirm("vas a eliminar todos los datos de tu cuenta, ¿continuar?");
        if(c){
            await deleteAuthUser();
            router.push("/");
        }

    }




    return (
        <div className="flex justify-center items-center h-screen  gap-16 mr-72 pb-32">
            <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-100 rounded-full ring-2 ring-offset-2">
                    <Image src={avatar} alt=""></Image>
                </div>
            </div>
            <form onSubmit={handleChanges}>
                <fieldset className="fieldset">

                    <legend className="fieldset-legend text-xl">Nombre y apellidos</legend>
                    <div className="flex flex-row items-center gap-2 ">
                        <NombreApellidosInput
                            value={authUserData?.full_name || "desconocido"}
                            onValueChanged={(e) => setAuthUserData({ full_name: e })}
                            disabled={name_disabled}></NombreApellidosInput>
                        <button className="btn btn-sm btn-square" type="button" onClick={() => set_name_disabled(!name_disabled)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                        </button>
                    </div>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend text-xl">Correo electrónico</legend>
                    <div className="flex flex-row items-center gap-2">
                        <EmailInput value={authUserData?.email || "desconocido"} onValueChanged={(email) => setAuthUserData({ email: email })} disabled={email_disabled}> </EmailInput>
                        <button className="btn btn-sm btn-square" type="button" onClick={() => set_email_disabled(!email_disabled)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                        </button>
                    </div>
                </fieldset>
                <label className="text-xl" >ROL: {authUserData?.role || "desconocido"}</label>
                <div className="flex flex-row justify-between mt-5 gap-1">
                    <button className="btn btn-primary" type="submit" >Aplicar Cambios</button>
                    <li className="btn btn-accent"><Link href={"/main_navigation/users/myProfile/changePassword"}>Cambiar contraseña</Link></li>
                </div>
                <button className="btn btn-error mt-10 w-full" type="button" onClick={deleteUser}>Borrar cuenta</button>
            </form>


        </div>
    );
}
