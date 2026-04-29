"use client"
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import useDeviceStore from "@/stores/deviceStore";
import { useShallow } from "zustand/shallow";


export default function DevicesMainPage() {
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
            alert(error);
        }
    }, [fetchDevices, error]);

    const router = useRouter();
    const Map = useMemo(() => dynamic(
        () => import('@/components/DeviceMap'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])
    return (
        <div className="flex flex-col p-2 gap-1 justify-start h-screen w-full">
            <div className="flex flex-row h-1/12 w-full flex-1 gap-1 justify-start">
                <div className="card card-border bg-neutral shadow-sm h-full w-7/10">
                    <div className="card-body">
                        <h1 className="card-title justify-center text-neutral-content">Area de dispostivos</h1>
                    </div>
                </div>
                <div className="flex justify-start items-start h-full w-2/10">
                    <button className="btn btn-primary h-full w-full" onClick={ () => router.push("/main_navigation/devices/newDevice")}>Desplegar nuevo</button>
                </div>
            </div>
            <div className="flex h-9/10 w-full">
                {!isLoading &&
                    <Map position={[40.96882, -5.66388]} zoom={8} devices={devices} scrollWheelZoom={true} clickFunction={(deviceId) => router.push(`/main_navigation/devices/${deviceId}`)}/>
                }
            </div>
        </div>
    );

}
