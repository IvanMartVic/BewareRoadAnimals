"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useLogStore from "@/stores/logStore";
import useDeviceStore from "@/stores/deviceStore"
import { useShallow } from "zustand/shallow";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import dynamic from "next/dynamic";


export default function LogsMainPage() {
    const { deviceId } = useParams();
    const [selectedId, setSelectedId] = useState(null);
    const { fetchLogs, fetchDeviceLogs, logs, deleteLog, deleteAllLogs } = useLogStore(
        useShallow((state => ({
            logs: state.logs,
            fetchLogs: state.fetchLogs,
            fetchDeviceLogs: state.fetchDeviceLogs,
            deleteLog: state.deleteLog,
            deleteAllLogs: state.deleteAllLogs,
        })))
    );
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
        if(devices){
            const device = devices.find((d) => d.id == deviceId);
            setPageDevice(device);
        }
    }, [devices, setPageDevice, deviceId]);

    const refreshLogs = () => {
        if(deviceId != "null"){
            fetchDeviceLogs(+deviceId);
        }else{
            fetchLogs();
        }
    };

    useEffect(() => {
        if(deviceId != "null"){
            fetchDeviceLogs(+deviceId);
        }else{
            fetchLogs();
        }
    }, [fetchDeviceLogs, fetchLogs, deviceId]);

    async function handleSearch({ searchInput }) {
        // if (searchInput) {
        //     const onlyUser = [];
        //     const user = await getUserById(+searchInput);
        //     if (user) {
        //         onlyUser.push(user);
        //     }
        //     setUsers(onlyUser);
        // } else {
        //     const allUsers = await getAllUsers();
        //     setUsers(allUsers);
        // }
        alert(JSON.stringify(logs));
    }
    function handleSelect(newId) {
        if (selectedId == newId) {
            setSelectedId(null);
        } else {
            setSelectedId(newId);
        }
    }

    async function deleteSelectedLog() {
        const log = await deleteLog(selectedId);
        refreshLogs();
    }
    async function deleteUserLogs(){
        deleteAllLogs();
    }

    const Map = useMemo(() => dynamic(
        () => import('@/components/DeviceMap'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    const router = useRouter();
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
            <div className="flex flex-row gap-8 h-1/5 w-full justify-between items-start">
                <div className="card bg-neutral  card-border shadow-accent w-1/5 hover:cursor-pointer hover:bg-neutral-500">
                    <div className="card-body">
                        <h1 className="card-title justify-start text-neutral-content">Logs:</h1>
                    </div>
                </div>
                <div className="card bg-base-300 card-border shadow-accent w-1/5 hover:cursor-pointer hover:bg-neutral-500">
                    <div className="card-body">
                        <h1 className="card-title justify-start ">Detecciones: 10</h1>
                    </div>
                </div>
                <div className="card bg-base-300 card-border shadow-accent w-1/5 hover:cursor-pointer hover:bg-neutral-500">
                    <div className="card-body">
                        <h1 className="card-title justify-start ">Sistema: 3</h1>
                    </div>
                </div>
                <div className="card bg-warning card-border shadow-accent w-1/5 hover:cursor-pointer hover:bg-primary">
                    <div className="card-body">
                        <h1 className="card-title justify-start ">Aviso Batería: </h1>
                    </div>
                </div>

            </div>
        </div>
    );

}

