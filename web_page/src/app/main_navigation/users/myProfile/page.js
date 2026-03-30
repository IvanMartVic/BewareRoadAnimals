"use client"
import avatar from "@/../public/avatar.jpg"
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import useAuthStore from "@/stores/authStore"
import { useShallow } from "zustand/shallow";
import  useUserStore  from "@/stores/userStore"
import { useRouter } from "next/navigation";

export default function MyProfilePage() {
    const [name_disabled, set_name_disabled] = useState(true);
    const [email_disabled, set_email_disabled] = useState(true);
    const router = useRouter();
    const { authUserData, fetchAuthUser, setAuthUserData, updateAuthUser} = useAuthStore(
        useShallow((state) => ({
            authUserData: state.authUserData,
            fetchAuthUser: state.fetchAuthUser,
            setAuthUserData: state.setAuthUserData,
            updateAuthUser: state.updateAuthUser,
        }))
    );

    useEffect(() => {
        fetchAuthUser();
    }, [fetchAuthUser]);

    const handleChanges = async () => {
        if(authUserData){
            const new_data = {full_name:authUserData?.full_name, email:authUserData?.email}
            updateAuthUser(new_data);
        }
        alert("información cambiada con éxito");
        router.push("/main_navigation")
    }




    return (
        <div className="flex justify-start items-center h-screen gap-16 ml-60 pb-32">
            <div className="avatar">
                <div className="ring-primary ring-offset-base-100 w-100 rounded-full ring-2 ring-offset-2">
                    <Image src={avatar} alt=""></Image>
                </div>
            </div>
            <ul>
                <li>
                    <fieldset className="fieldset">

                        <legend className="fieldset-legend text-xl">Nombre y apellidos</legend>
                        <div className="flex flex-row items-center gap-2">
                            <input className="input w-96 placeholder:text-base-content placeholder:opacity-100 disabled:opacity-100" type="text" value={authUserData?.full_name || "desconocido"} onChange={(e) => setAuthUserData({full_name:e.target.value})} disabled={name_disabled} />
                            <button className="btn btn-sm btn-square" onClick={() => set_name_disabled(!name_disabled)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                            </button>
                        </div>
                    </fieldset>
                </li>
                <li>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-xl">correo electrónico</legend>
                        <div className="flex flex-row items-center gap-2">
                            <input className="input w-96 placeholder:text-base-content placeholder:opacity-100" type="text" value={authUserData?.email || "desconocido"} onChange={(e) => setAuthUserData({email: e.target.value})} disabled={email_disabled} />
                            <button className="btn btn-sm btn-square" onClick={() => set_email_disabled(!email_disabled)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" /></svg>
                            </button>
                        </div>
                    </fieldset>
                </li>
                <li className="text-xl" >ROL: {authUserData?.role || "desconocido"}</li>
                <div className= "flex flex-row justify-between mt-5">
                    <button className="btn btn-soft btn-primary" onClick={handleChanges}>Aplicar Cambios</button>
                    <li className="btn btn-soft btn-accent"><Link href={"/main_navigation/users/myProfile/changePassword"}>Cambiar contraseña</Link></li>
                </div>

            </ul>


        </div>
    );
}
