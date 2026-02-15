"use client"
import EmailInput from "@/components/emailInput";
import NombreApellidosInput from "@/components/nombreApellidosInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUser } from "../services/userService";

export default function UserUpdateForm({user, submitRoute}){
    const [name, setName] = useState(user.full_name);
    const [email, setEmail] = useState(user.email);
    const [adminChecked, setAdmin] = useState(user.role == "ADMIN");
    const router = useRouter();
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        const role = adminChecked? "ADMIN": "USER";
        const userData = {full_name:name, email:email, role:role};
        // await createUser(userData);
        await updateUser({id:user.id, new_data:userData});
        e.target.reset();
        afterSubmit();
    }
    const checkboxChanged = (e) => {
        setAdmin(e.target.checked);
    }
    const afterSubmit = () => {
        router.push(submitRoute);

    }
    return (
        <div className="flex justify-start items-start">
            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 gap-7">
                    <legend className="fieldset-legend text-xl">Editar usuario</legend>
                    <NombreApellidosInput onValueChanged={(val) => setName(val)} value={name}></NombreApellidosInput>
                    <EmailInput onValueChanged={(val) => setEmail(val)} value={email}></EmailInput>
                    <label className="label text-xl">
                        <input type="checkbox" className="checkbox" onChange={checkboxChanged} checked={adminChecked}/>
                        ADMIN
                    </label>
                    <button type="submit" className="btn btn-neutral mt-4">Actualizar</button>
                </fieldset>
            </form>

        </div>
    );

}
