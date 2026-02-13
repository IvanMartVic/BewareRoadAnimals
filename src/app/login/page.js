"use client"
import PasswordInput from "@/components/passwordInput";
import EmailInput from "@/components/emailInput";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleSubmit = (e) => {
        alert( `${password} ${email}` );
    }
    return (
        <div className="flex justify-center items-center h-screen">
            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend">Login</legend>

                    <label className="label">Email</label>
                    <EmailInput onValueChanged={(val) => setEmail(val)}></EmailInput>

                    <label className="label">Password</label>
                    <PasswordInput onValueChanged={(val) => setPassword(val)}></PasswordInput>
                    <Link className="link link-hover mt-4" href={"/"}>Recuperar contraseña</Link>

                    <button type="submit" className="btn btn-neutral mt-4">Login</button>
                </fieldset>
            </form>

        </div>
    );
}
