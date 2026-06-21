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
import { useModal } from "@/context/AlertContext";


export default function LogsMainPage() {
    const { deviceId } = useParams();
    const [pageDevice, setPageDevice] = useState(null);
    const { fetchDevices, isLoading, devices, deleteDevice, error } = useDeviceStore(
        useShallow((state) => ({
            fetchDevices: state.fetchDevices,
            isLoading: state.isLoading,
            devices: state.devices,
            deleteDevice: state.deleteDevice,
            error: state.error,
        })));
    useEffect(() => {
        fetchDevices();
    }, [fetchDevices]);
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
    const { showConfirm } = useModal();
    const handleDelete = async () => {
        const choice = await showConfirm({ message: "Vas a eliminar un dispositivo ¿continuar?" });
        if (choice) {
            deleteDevice(+deviceId);
            router.push("/main_navigation/devices")
        }

    }

    const router = useRouter();
    const deviceFilter = useMemo(() => ({ deviceId: +deviceId }), [deviceId]);
    return (
        <div
            className="flex flex-col gap-4 justify-start items-start h-screen p-10 w-full">
            <div className="flex flex-row w-full justify-between">
                <div className="flex flex-col w-full">
                    <h1 className="text-3xl font-bold">Dispositivo {deviceId}</h1>
                    {!isLoading &&
                        <h1>Desplegado por {pageDevice?.deployedBy?.full_name || "desconocido"}</h1>
                    }
                </div>
                <div className="flex items-center p-[1vw]">
                    <button className="btn btn-error btn-soft btn-sm" onClick={handleDelete}>Eliminar dispositivo</button>
                </div>
            </div>
            <div className="flex w-full h-[60vh] p-[1vh] items-start">
                <div className="flex h-full w-full">
                    {!isLoading && pageDevice &&
                        <Map position={[pageDevice?.coordLatitude, pageDevice?.coordLength]} zoom={13} devices={devices} />
                    }
                </div>
            </div>
            {deviceFilter &&
                <div className="flex p-[1vw] w-full">
                    <LogsOverview filters={deviceFilter} ></LogsOverview>

                </div>
            }
        </div>
    );

}

