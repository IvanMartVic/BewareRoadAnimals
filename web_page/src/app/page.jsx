"use client"
import PasswordInput from "@/components/passwordInput";
import EmailInput from "@/components/emailInput";
import { useState } from "react";
import { SignIn } from "@/services/authenticationService"
import Link from "next/link";
import { useRouter } from "next/navigation";



export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const router = useRouter();
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        const response = await SignIn({ password: password, email: email });
        if (!response.success) {
            setError(response);
            return;
        }
        router.push("/main_navigation");
    }
    return (
        <div className="flex justify-center items-center h-screen bg-base-300">
            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
                    <legend className="fieldset-legend text-primary text-xl">Iniciar Sesion</legend>
                    <label className="label">Correo electrónico</label>
                    <EmailInput onValueChanged={(val) => setEmail(val)} validate={false}></EmailInput>

                    <label className="label">Contraseña</label>
                    <PasswordInput onValueChanged={(val) => setPassword(val)} validate={false}></PasswordInput>
                    <Link className="link link-hover mt-4" href={"/reset"}>Recuperar contraseña</Link>
                    <button type="submit" className="btn btn-primary mt-4">Inciar Sesión</button>
                    {error &&
                        <p className="text-red-200 font-bold">{error?.message}</p>
                    }
                </fieldset>
            </form>
        </div>
    );
}
