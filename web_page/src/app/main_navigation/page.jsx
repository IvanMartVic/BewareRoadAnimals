"use client"
import { useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import useDeviceStore from "@/stores/deviceStore"
import { useShallow } from "zustand/shallow";

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

    return (
        <div
            className="flex h-screen justify-between items-center p-20">
            <h1 className="text-9xl">Hola mundo</h1>
            {!isLoading &&
                <Map position={[40.96882, -5.66388]} zoom={8} devices={devices} />
            }
        </div>
    );
}
