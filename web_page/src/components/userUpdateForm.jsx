"use client"
import EmailInput from "@/components/emailInput";
import NombreApellidosInput from "@/components/nombreApellidosInput";
import { useState } from "react";
import { useRouter } from "next/navigation";
import useUserStore from "@/stores/userStore"

export default function UserUpdateForm({ user, submitRoute }) {
    const [name, setName] = useState(user.full_name);
    const [email, setEmail] = useState(user.email);
    const [adminChecked, setAdmin] = useState(user.role == "ADMIN");
    const router = useRouter();
    const updateUser = useUserStore((state) => state.updateUser);
    const deleteUser = useUserStore((state) => state.deleteUser);

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        const role = adminChecked ? "ADMIN" : "USER";
        const userData = { full_name: name, email: email, role: role };
        // await createUser(userData);
        await updateUser({ id: user.id, new_data: userData });
        e.target.reset();
        afterSubmit();
    }
    const handleDelete = async () => {
        const choice = confirm(`¿está seguro de que quiere eliminar al usuario ${user.full_name}?`);
        if(choice){
            deleteUser(user.id);
            router.push("/main_navigation/users");
        }
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
                    <legend className="fieldset-legend text-primary text-xl">Editar usuario</legend>
                    <div>
                        <NombreApellidosInput onValueChanged={(val) => setName(val)} value={name}></NombreApellidosInput>
                    </div>
                    <div>
                        <EmailInput onValueChanged={(val) => setEmail(val)} value={email}></EmailInput>
                    </div>
                    <label className="label text-xl">
                        <input type="checkbox" className="checkbox" onChange={checkboxChanged} checked={adminChecked} />
                        ADMIN
                    </label>
                    <div className="flex justify-between mt-4">
                        <button type="submit" className="btn btn-primary text-primary-content">Actualizar</button>
                        <button type="button" className="btn btn-error text-error-content" onClick={handleDelete}>Eliminar usuario</button>
                    </div>
                </fieldset>
            </form>

        </div>
    );

}
