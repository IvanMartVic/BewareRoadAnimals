"use client"
import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import useDeviceStore from "@/stores/deviceStore"
import { useShallow } from "zustand/shallow";
import useAuthStore from "@/stores/authStore"
import perropic from "@/../public/perro_gracios.jpeg"
import LogsOverview from "@/components/LogsOverview";
import Image from "next/image";

export default function Home() {
    const Map = useMemo(() => dynamic(
        () => import('@/components/DeviceMap'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])
    const { fetchDevices, isLoading, devices, error } = useDeviceStore(
        useShallow((state) => ({
            fetchDevices: state.fetchDevices,
            isLoading: state.isLoading,
            devices: state.devices,
            deleteDevice: state.deleteDevice,
            error: state.error,
        })));
    useEffect(() => {
        fetchDevices();
        if (error != null) {
            alert(error)
        }
    }, [fetchDevices, error]);

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
            className="flex flex-col h-screen gap-4 justify-start items-start p-20">
            <h1 className="text-xl">Bienvenido {authUserData?.full_name}</h1>
            <h2>{date.getDate()}/{date.getMonth() + 1}/{date.getFullYear()}  {date.getHours()}:{date.getMinutes()}</h2>
            <div
                className="flex flex-row h-3/5 justify-start gap-4 items-start mt-5 w-full">
                <div className="flex flex-col w-1/5 h-full gap-2 justify-between items-center">
                    <div className="card bg-error w-full h-1/2 hover:cursor-pointer hover:bg-primary">
                        <div className="card-body">
                            <h1 className="card-title justify-start text-neutral-content">Alertas </h1>
                            <p className="ml-2">  en las últimas 24h</p>
                            <p className="justify-end text-end text-neutral-content text-bold text-xl">24</p>
                        </div>
                    </div>
                    <div className="card bg-secondary w-full h-1/2 hover:cursor-pointer hover:bg-primary">
                        <div className="card-body">
                            <h1 className="card-title justify-start text-neutral-content">Usuarios </h1>
                            <p className="ml-2">  datos de alta en el sistema</p>
                            <p className="text-end text-secondary-content text-bold text-xl">2</p>
                        </div>
                    </div>
                </div>
                <div className="bg-neutral h-full w-2/5 relative"> <Image className="object-cover" fill src={perropic} alt=""></Image> </div>
                <div className="bg-neutral h-full w-2/5 relative"> <Image className="object-cover" fill src={perropic} alt=""></Image> </div>
            </div>
            <LogsOverview/>

        </div>
    );
}
