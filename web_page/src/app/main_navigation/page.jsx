"use client"
import { useEffect } from "react";
import { useShallow } from "zustand/shallow";
import useAuthStore from "@/stores/authStore"
import LogsOverview from "@/components/LogsOverview";
import UsersOverview from "@/components/UsersOverview";
import DevicesOverview from "@/components/DevicesOverview";
import DevicesUserOverview from "@/components/DevicesUserOverview";
import DetectionsHeatmap from "@/components/heatmap";
import DaysHeatmap from "@/components/heatmap_dias";


export default function Home() {
    const { authUserData, fetchAuthUser, errorAuth } = useAuthStore(
        useShallow((state) => ({
            authUserData: state.authUserData,
            fetchAuthUser: state.fetchAuthUser,
            errorAuth: state.error,
        })));
    useEffect(() => {
        fetchAuthUser();
    }, [fetchAuthUser, errorAuth])

    return (
        <>
            {
                authUserData &&
                <div>
                    {
                        authUserData.role == "ADMIN" ?
                            (<AdminHome />) :
                            (<UserHome />)
                    }
                </div>
            }
        </>
    );
}
function AdminHome() {
    const { authUserData, fetchAuthUser, errorAuth } = useAuthStore(
        useShallow((state) => ({
            authUserData: state.authUserData,
            fetchAuthUser: state.fetchAuthUser,
            errorAuth: state.error,
        })));
    useEffect(() => {
        fetchAuthUser();
    }, [fetchAuthUser])

    const date = new Date();
    return (
        <div
            className="flex flex-col md:h-screen gap-4 justify-start items-start p-[5vw]">
            <h1 className="text-xl">Bienvenido {authUserData?.full_name}</h1>
            <h2>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}  {date.getHours()}:{date.getMinutes()}</h2>
            <div
                className="flex flex-col justify-start gap-4 items-start mt-5 w-full
        md:flex-row h-full ">
                <div className="flex flex-col w-full md:w-1/5 h-full gap-2 justify-between items-center">
                    <DevicesOverview />
                    <UsersOverview />
                </div>
                <div className="shrink-0 md:w-2/5 md:h-full h-[320px] w-[400px] relative">
                    <DetectionsHeatmap />
                </div>
                <div className="shrink-0 md:w-2/5 md:h-full h-[320px] w-[400px] relative">
                    <DaysHeatmap />
                </div>
            </div>
            <LogsOverview />

        </div>
    );
}
function UserHome() {
    const { authUserData, fetchAuthUser, errorAuth } = useAuthStore(
        useShallow((state) => ({
            authUserData: state.authUserData,
            fetchAuthUser: state.fetchAuthUser,
            errorAuth: state.error,
        })));
    useEffect(() => {
        fetchAuthUser();
    }, [fetchAuthUser])

    const date = new Date();
    return (
        <div
            className="flex flex-col h-screen gap-4 justify-start items-start p-[5vw]">
            <h1 className="text-xl">Bienvenido {authUserData?.full_name}</h1>
            <h2>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}  {date.getHours()}:{date.getMinutes()}</h2>
            <div
                className="flex flex-row h-3/5 justify-start gap-4 items-start mt-5 w-full">
                <div className="flex flex-col w-1/5 h-full gap-2 justify-center items-center">
                    <DevicesUserOverview id={authUserData.id} />
                </div>
                <div className="h-full w-4/5 relative">
                    <DetectionsHeatmap />
                </div>
            </div>
            <LogsOverview />

        </div>
    );
}



