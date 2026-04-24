"use client"
import PasswordInput from "@/components/passwordInput";
import EmailInput from "@/components/emailInput";
import NombreApellidosInput from "@/components/nombreApellidosInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/stores/userStore"

export default function NewUserPage() {
    const router = useRouter();
    const addUser = useUserStore((state) => state.addUser);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [adminChecked, setAdmin] = useState(false)
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        const userData = {full_name:name, email:email, password:password, isAdmin:adminChecked};
        await addUser(userData);
        e.target.reset();
        router.push("/main_navigation");
    }
    const checkboxChanged = (e) => {
        setAdmin(e.target.checked);
    }
    return (
        <div className="flex justify-center items-center p-10 h-screen">
            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 gap-7">
                    <legend className="fieldset-legend text-primary text-xl">Nuevo Usuario</legend>
                    <div>
                        <NombreApellidosInput onValueChanged={(val) => setName(val)}></NombreApellidosInput>
                    </div>
                    <div>
                        <EmailInput onValueChanged={(val) => setEmail(val)}></EmailInput>
                    </div>
                    <div>
                        <PasswordInput onValueChanged={(val) => setPassword(val)}></PasswordInput>
                    </div>
                    <label className="label text-xl">
                        <input type="checkbox" className="checkbox" onChange={checkboxChanged}/>
                        ADMIN
                    </label>
                    <button type="submit" className="btn btn-primary mt-4">Añadir</button>
                </fieldset>
            </form>

        </div>
    );
}
