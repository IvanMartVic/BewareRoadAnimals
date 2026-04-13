"use client"
import { useEffect, useState, useMemo } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
// import { getAllUsers, getUserById, deleteUser } from "@/services/userService";
import papelera from "@/../public/papelera.jpg";
import plus from "@/../public/plus_icon.jpg";
import log_icon from "@/../public/log_icon.jpg";
import { useRouter } from "next/navigation";
import useDeviceStore from "@/stores/deviceStore";
import { useShallow } from "zustand/shallow";


export default function DevicesMainPage() {
    const [selectedId, setSelectedId] = useState(null);
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
                <div className="card card-border bg-neutral shadow-sm h-full w-9/10">
                    <div className="card-body">
                        <h1 className="card-title justify-center text-neutral-content">Area de dispostivos</h1>
                    </div>
                </div>
                <div className="flex justify-start items-start h-full">
                    <button className="btn btn-primary h-full">Añadir</button>
                </div>
            </div>
            <div className="flex h-9/10 w-full">
                {!isLoading &&
                    <Map position={[40.96882, -5.66388]} zoom={8} devices={devices} scrollWheelZoom={true} clickFunction={(deviceId) => router.push(`/main_navigation/devices/logs/${deviceId}`)}/>
                }
            </div>
        </div>
    );

    // <div
    //     className="flex flex-col gap-4 justify-start items-start h-screen ">
    //     <h1 className="text-2xl text-bold"></h1>
    //     <div className="flex flex-row gap-4 items-center flex-1 w-full">
    //         <div className="flex flex-col gap-4">
    //             <div role="button" className="btn btn-ghost btn-circle avatar">
    //                 <div className="w-10 rounded-full">
    //                     <Image src={papelera} alt=""></Image>
    //                 </div>
    //             </div>
    //             <div role="button" className="btn btn-ghost btn-circle avatar" onClick={() => router.push("/main_navigation/devices/newDevice")}>
    //                 <div className="w-10 rounded-full">
    //                     <Image src={plus} alt=""></Image>
    //                 </div>
    //             </div>
    //             <div role="button" className="btn btn-ghost btn-circle avatar" onClick={() => router.push(`/main_navigation/devices/logs/${selectedId}`)}>
    //                 <div className="w-10 rounded-full">
    //                     <Image src={log_icon} alt=""></Image>
    //                 </div>
    //             </div>
    //         </div>
    //         {!isLoading &&
    //             <Map position={[40.96882, -5.66388]} zoom={8} devices={devices} />
    //         }
    //     </div>
    // </div>
}
