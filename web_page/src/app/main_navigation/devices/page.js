"use client"
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import useDeviceStore from "@/stores/deviceStore";
import { useShallow } from "zustand/shallow";
import Image from "next/image";
import plus from "@/../public/plus_icon.jpg";
import useAuthStore from "@/stores/authStore";


export default function DevicesMainPage() {
    const { fetchDevices, isLoading, devices, error } = useDeviceStore(
        useShallow((state) => ({
            fetchDevices: state.fetchDevices,
            isLoading: state.isLoading,
            devices: state.devices,
            deleteDevice: state.deleteDevice,
            error: state.error,
        })));

    const { authUserData, fetchAuthUser, errorAuth } = useAuthStore(
        useShallow((state) => ({
            authUserData: state.authUserData,
            fetchAuthUser: state.fetchAuthUser,
            errorAuth: state.error,
        })));

    useEffect(() => {
        fetchAuthUser();
    }, [fetchAuthUser, errorAuth])

    useEffect(() => {
        if (authUserData?.id) {
            if (authUserData.role == "USER") {
                fetchDevices({ userId: authUserData.id });
            } else {
                fetchDevices();
            }
        }
    }, [fetchDevices, error, authUserData?.id]);

    const router = useRouter();
    const Map = useMemo(() => dynamic(
        () => import('@/components/DeviceMap'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])
    return (
        <div className="relative w-full h-screen overflow-hidden">
            <div className="flex justify-between z-10 pointer-events-none relative p-[2vh]">
                <div className="ml-10 flex flex-col bg-base-100 backdrop-blur-md p-4 rounded-box border border-base-300 shadow-lg pointer-events-auto">
                    <h1 className="text-2xl text-bold">Dispositivos deplegados</h1>
                </div>
                <div className="flex justify-end items-end pointer-events-auto">
                    <div role="button" className="btn btn-ghost btn-circle avatar" onClick={() => router.push("/main_navigation/devices/newDevice")}>
                        <div className="w-10 rounded-full">
                            <Image src={plus} alt=""></Image>
                        </div>
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 z-0 h-screen w-full">
                {!isLoading &&
                    <Map position={[40.96882, -5.66388]} zoom={8} devices={devices} scrollWheelZoom={true} clickFunction={(deviceId) => router.push(`/main_navigation/devices/deviceDetails/${deviceId}`)} />
                }
            </div>
        </div>
    );

}
