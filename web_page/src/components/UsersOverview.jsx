"use client"
import useUserStore from "@/stores/userStore"
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import { useRouter } from "next/navigation";

export default function UsersOverview() {
    const { count, fetchUsersCount, error } = useUserStore(
        useShallow((s) => ({
            count: s.count,
            fetchUsersCount: s.fetchUsersCount,
            error: s.error,
        })));

    useEffect(() => {
        fetchUsersCount();
    }, [fetchUsersCount]);
    const router = useRouter();
    return (
        <div className="card bg-secondary w-full h-1/2 hover:cursor-pointer hover:bg-neutral-500" onClick={ () => router.push("/main_navigation/users")}>
            <div className="card-body">
                <h1 className="card-title justify-start text-secondary-content">Usuarios </h1>
                <p className="ml-2">  datos de alta en el sistema</p>
                <p className="text-end text-secondary-content text-bold text-xl">{count}</p>
                {error && 
                    <p className="justify-end text-end text-error text-bold text-xl">{error}</p>
                }
            </div>
        </div>
    )

}
