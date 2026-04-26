"use client"
import EmailInput from "@/components/emailInput"
import { useState } from "react";
import { resetPassword } from "@/services/emailService"
import { useRouter } from "next/navigation";
export default function ResetPage() {
    const [email, setEmail] = useState("");
    const router = useRouter();

    async function handleSubmit(e) {
        e.preventDefault();
        const { success, error } = await resetPassword(email);
        if (success) {
            alert('Se ha mandado un mensaje a tu correo electrónico')
            router.push("/");
        } else {
            alert(`${error}`);
        }
    }
    return (
        <div className="flex h-screen w-screen bg-base-100 items-center justify-center">
            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 gap-4">
                    <legend className="fieldset-legend text-primary text-xl">Recuperar contraseña</legend>
                    <div>
                        <EmailInput onValueChanged={(val) => setEmail(val)} value={email}></EmailInput>
                    </div>
                    <div className="flex justify-start">
                        <button type="submit" className="btn btn-primary text-primary-content text-center">mandar correo recuperación</button>
                    </div>
                </fieldset>
            </form>

        </div>
    );

}
