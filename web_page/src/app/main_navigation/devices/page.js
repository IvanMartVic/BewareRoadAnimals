"use client"
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import useDeviceStore from "@/stores/deviceStore";
import { useShallow } from "zustand/shallow";
import Image from "next/image";
import plus from "@/../public/plus_icon.jpg";


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
        <div className="flex flex-col p-[2vw] gap-1 justify-start w-full h-full">
            <div className="flex justify-between">
                <div className="flex items-end">
                    <h1 className="text-2xl text-bold">Dispositivos deplegados</h1>
                </div>
                <div className="flex justify-end items-end">
                    <div role="button" className="btn btn-ghost btn-circle avatar" onClick={() => router.push("/main_navigation/devices/newDevice")}>
                        <div className="w-10 rounded-full">
                            <Image src={plus} alt=""></Image>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-start h-9/10 w-full">
                <div className="flex justify-start h-[80vh] w-full">
                    {!isLoading &&
                        <Map position={[40.96882, -5.66388]} zoom={8} devices={devices} scrollWheelZoom={true} clickFunction={(deviceId) => router.push(`/main_navigation/devices/deviceDetails/${deviceId}`)} />
                    }
                </div>

            </div>
        </div>
    );

}
