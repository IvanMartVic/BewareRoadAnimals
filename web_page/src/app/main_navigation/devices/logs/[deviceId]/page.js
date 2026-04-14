"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLogStore from "@/stores/logStore";
import useDeviceStore from "@/stores/deviceStore"
import { useShallow } from "zustand/shallow";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import LogsOverview from "@/components/LogsOverview";


export default function LogsMainPage() {
    const { deviceId } = useParams();
    const [pageDevice, setPageDevice] = useState(null);
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
    useEffect(() => {
        if (devices) {
            const device = devices.find((d) => d.id == deviceId);
            setPageDevice(device);
        }
    }, [devices, setPageDevice, deviceId]);




    const Map = useMemo(() => dynamic(
        () => import('@/components/DeviceMap'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    const router = useRouter();
    const deviceFilter = useMemo(() => ({ deviceId: +deviceId }), [deviceId]);
    return (
        <div
            className="flex flex-col gap-4 justify-start items-start h-screen p-10">
            <div className="flex flex-row w-full justify-between">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">Dispositivo {deviceId}</h1>
                    {!isLoading &&
                        <h1>Desplegado por {pageDevice?.deployedBy?.full_name || "desconocido"}</h1>
                    }
                </div>
                <div className="card bg-error card-border shadow-accent w-1/5 hover:cursor-pointer hover:bg-neutral-500">
                    <div className="card-body">
                        <h1 className="card-title justify-start text-neutral-content">Alertas:</h1>
                    </div>
                </div>
            </div>
            <div className="flex h-5/10 w-1/2">
                {!isLoading && pageDevice &&
                    <Map position={[pageDevice?.coordLatitude, pageDevice?.coordLength]} zoom={13} devices={devices} />
                }
            </div>
            {deviceFilter && 
                <LogsOverview filters={deviceFilter} ></LogsOverview>
            }
        </div>
    );

}

