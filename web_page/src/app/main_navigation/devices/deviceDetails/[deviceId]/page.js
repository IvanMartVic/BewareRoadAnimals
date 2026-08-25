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
        <div className="relative w-full h-screen overflow-hidden">
            <div className="absolute inset-0 z-0 w-full h-full">
                {!isLoading && pageDevice && (
                    <Map
                        dragging={false}
                        position={[pageDevice?.coordLatitude, pageDevice?.coordLength]}
                        zoom={13}
                        devices={devices}
                    />
                )}
            </div>
            <div className="relative z-10 flex flex-col justify-between h-[90vh] p-2 space-y-4 pointer-events-none">

                <div className="flex flex-row w-full justify-between items-start gap-4">
                    <div className="flex flex-col bg-base-100 backdrop-blur-md p-4 rounded-box border border-base-300 shadow-lg pointer-events-auto">
                        <h1 className="text-3xl font-bold">Dispositivo {deviceId}</h1>
                        {!isLoading && (
                            <div className="mt-1 text-sm opacity-90">
                                <p><strong>Desplegado por:</strong> {pageDevice?.deployedBy?.full_name || "desconocido"}</p>
                                <p><strong>Token de despliegue:</strong> {pageDevice?.deployToken}</p>
                            </div>
                        )}
                    </div>
                    <div>
                        <button className="btn btn-error btn-soft btn-sm pointer-events-auto" onClick={handleDelete}>
                            Eliminar dispositivo
                        </button>
                    </div>
                </div>
                {deviceFilter && (
                    <div className="pointer-events-auto">
                        <LogsOverview filters={deviceFilter} />
                    </div>
                )}
            </div>
        </div>
    );

}

