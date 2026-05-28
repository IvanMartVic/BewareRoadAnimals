"use client"

import { use, useEffect, useState } from "react"
import useAuthStore from "@/stores/authStore";
import useUserStore from "@/stores/userStore"
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/navigation";
import PasswordInput from "@/components/passwordInput"
import EmailInput from "@/components/emailInput";


export default function NewPassPage({ searchParams }) {
    let params = use(searchParams);
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [equal, setEqual] = useState(true);
    const { fetchAuthUserFromResetToken, fetchAuthUser, error, authUserData, resetError} = useAuthStore(useShallow(
        (s) => ({
            fetchAuthUserFromResetToken: s.fetchAuthUserFromResetToken,
            error: s.error,
            authUserData: s.authUserData,
            fetchAuthUser: s.fetchAuthUser,
            resetError: s.resetError,
        })));
    const resetUserPassword = useUserStore((s) => s.resetUserPassword);
    useEffect(() => {
        if (!params.jwt && !params.token) {
            router.push("/");
        }
        if (params.token) {
            fetchAuthUserFromResetToken(params.token);
        } else if (params.jwt) {
            fetchAuthUser();
        }
    }, [fetchAuthUserFromResetToken, params.token, router, fetchAuthUser, params.jwt]);
    useEffect(() => {
        if (error) {
            resetError();
            router.push("/");
        }

    },[error, resetError, router])
    async function handleSubmit(e) {
        e.preventDefault();
        if (password != repeatPassword) {
            setEqual(false);
            return
        }
        // stuff
        await resetUserPassword({ new_password: password, resetToken: params.token });
        if (!error) {
            alert("la contraseña se reseteo con éxito");
            router.push("/main_navigation");
        } else {
            alert(error);
            router.push("");
        }
    }


    return (
        <div className="flex justify-center bg-base-100 items-center p-10 h-screen">
            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 gap-2">
                    <legend className="fieldset-legend text-primary text-xl">Cambiar contraseña</legend>
                    <div>
                        <EmailInput value={authUserData?.email || "desconocido"} disabled={true}></EmailInput>
                    </div>
                    <div>
                        <legend className="fieldset-legend text-xs">Nueva contraseña</legend>
                        <PasswordInput onValueChanged={(val) => setPassword(val)}></PasswordInput>
                    </div>
                    <div>
                        <legend className="fieldset-legend text-xs">Repetir contraseña</legend>
                        <PasswordInput onValueChanged={(val) => setRepeatPassword(val)}></PasswordInput>
                    </div>
                    <button type="submit" className="btn btn-primary mt-4">Confirmar</button>
                    {!equal &&
                        <p className="text-error ml-5 font-bold">error: las contraseñas no coinciden</p>}
                </fieldset>
            </form>

        </div>
    )

}
