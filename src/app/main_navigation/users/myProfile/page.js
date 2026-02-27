"use client"
import avatar from "@/../public/avatar.jpg"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
export default function MyProfilePage() {
    const [name_disabled, set_name_disabled] = useState(true);
    const [email_disabled, set_email_disabled] = useState(true);
    const [name, set_name] = useState("Usuario Genérico Generez");
    const [email, set_email] = useState("alguien@example.com");

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
                            <input className="input w-96 placeholder:text-base-content placeholder:opacity-100 disabled:opacity-100" type="text" value={name} onChange={ (e) => set_name(e.target.value) } disabled={name_disabled} />
                            <button className="btn btn-sm btn-square" onClick={ () => set_name_disabled(!name_disabled)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                            </button>
                        </div>
                    </fieldset>
                </li>
                <li>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-xl">correo electrónico</legend>
                        <div className="flex flex-row items-center gap-2">
                            <input className="input w-96 placeholder:text-base-content placeholder:opacity-100" type="text" value={email} onChange={ (e) => set_email(e.target.value) }disabled={email_disabled} />
                            <button className="btn btn-sm btn-square" onClick={ () => set_email_disabled(!email_disabled)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                            </button>
                        </div>
                    </fieldset>
                </li>
                <li className="text-xl">admin/user</li>
                <li className="link-primary pt-5"><Link href={"/main_navigation/users/myProfile/changePassword"}>Cambiar contraseña</Link></li>

            </ul>


        </div>
    );
}
