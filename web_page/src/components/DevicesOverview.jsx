import useDeviceStore from "@/stores/deviceStore"
import { useEffect } from "react";
import { useShallow } from "zustand/shallow"
import { useRouter } from "next/navigation";
export default function DevicesOverview() {
    const {count, fetchDevicesCount, error} = useDeviceStore( useShallow(
        (s) => ({
            count: s.count,
            fetchDevicesCount: s.fetchDevicesCount,
            error: s.error,
        })
    ));
    useEffect( () => {
        fetchDevicesCount();
    },[fetchDevicesCount])
    const router = useRouter();

    return (
        <div className="card bg-primary w-full h-1/2 hover:cursor-pointer hover:bg-neutral-500" onClick={() => router.push("/main_navigation/devices")}>
            <div className="card-body">
                <h1 className="card-title justify-start text-neutral-content">Dispositivos</h1>
                <p className="ml-2 text-primary-content">dispositivos desplegados por el usuario</p>
                <p className="justify-end text-end text-primary-content text-bold text-xl">{count}</p>
                {error && 
                    <p className="justify-end text-end text-error text-bold text-xl">{error}</p>
                }
            </div>
        </div>
    )

}
