"use client"
import { useEffect} from "react";
import { useShallow } from "zustand/shallow";
import useAuthStore from "@/stores/authStore"
import LogsOverview from "@/components/LogsOverview";
import UsersOverview from "@/components/UsersOverview";
import DevicesOverview from "@/components/DevicesOverview";
import LogLineGraph from "@/components/LogLineGraph";
import TypePieChart from "@/components/TypePieChart";

export default function Home() {
    const { authUserData, fetchAuthUser, errorAuth } = useAuthStore(
        useShallow((state) => ({
            authUserData: state.authUserData,
            fetchAuthUser: state.fetchAuthUser,
            errorAuth: state.error,
        })));
    useEffect(() => {
        fetchAuthUser();
        if (errorAuth != null) {
            alert(errorAuth);
        }
    }, [fetchAuthUser, errorAuth])

    const date = new Date();
    return (
        <div
            className="flex flex-col h-screen gap-4 justify-start items-start p-[5vw]">
            <h1 className="text-xl">Bienvenido {authUserData?.full_name}</h1>
            <h2>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}  {date.getHours()}:{date.getMinutes()}</h2>
            <div
                className="flex flex-row h-3/5 justify-start gap-4 items-start mt-5 w-full">
                <div className="flex flex-col w-1/5 h-full gap-2 justify-between items-center">
                    <DevicesOverview/>
                    <UsersOverview/>
                </div>
                <div className="h-full w-2/5 relative"><LogLineGraph/></div>
                <div className="bg-neutral h-full w-2/5 relative"><TypePieChart/></div>
            </div>
            <LogsOverview/>

        </div>
    );
}
