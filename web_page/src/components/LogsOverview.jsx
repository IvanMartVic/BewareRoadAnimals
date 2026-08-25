"use client"
import useLogStore from "@/stores/logStore"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow"
import useAuthStore from "@/stores/authStore"

const DEFAULT_FILTERS = {}
export default function LogsOverview({ filters = DEFAULT_FILTERS }) {
    const { authUserData, fetchAuthUser, errorAuth } = useAuthStore(
        useShallow((state) => ({
            authUserData: state.authUserData,
            fetchAuthUser: state.fetchAuthUser,
            errorAuth: state.error,
        })));
    useEffect(() => {
        fetchAuthUser();
    }, [fetchAuthUser, errorAuth])
    const { fetchLogTypeCount, logCount, systemCount, detectCount, batteryWarningCount, isLoading, error } = useLogStore(
        useShallow((s) => ({
            fetchLogTypeCount: s.fetchLogTypeCount,
            logCount: s.logCount,
            systemCount: s.systemCount,
            detectCount: s.detectCount,
            batteryWarningCount: s.batteryWarningCount,
            isLoading: s.isLoading,
            error: s.error,
        })));
    useEffect(() => {
        //hay una race-condition aquí si los filtros cambian rápidamente
        if (authUserData?.id) {
            const queryFilter = { ...filters }
            fetchLogTypeCount?.(queryFilter);
        }
    }, [fetchLogTypeCount, filters, authUserData?.id])
    const router = useRouter();
    const urlDeviceFilter = filters.deviceId ? `deviceId=${filters.deviceId}` : "";
    const urlUserFilter = filters?.deviceIn?.userId ? `userId=${filters.deviceIn.userId}` : "userId=ALL";


    return (
        <>
            {!isLoading &&
                < div className="flex flex-col gap-8 h-1/5 w-full items-start" >
                    < div className="grid grid-cols-2 md:grid-cols-4 gap-8 h-full w-full justify-between items-start" >
                        <div className={`card bg-neutral  card-border shadow-accent  hover:cursor-pointer hover:bg-neutral-500`} onClick={() => router.push(`/main_navigation/logs?${urlDeviceFilter}&${urlUserFilter}`)}>
                            <div className="card-body">
                                <h1 className="card-title justify-start text-neutral-content">Logs: {logCount}</h1>
                            </div>
                        </div>

                        <div className="card bg-base-300 card-border shadow-accent  hover:cursor-pointer hover:bg-neutral-500" onClick={() => router.push(`/main_navigation/logs?${urlDeviceFilter}&${urlUserFilter}&type=SISTEMA`)}>
                            <div className="card-body">
                                <h1 className="card-title justify-start ">Sistema: {systemCount}</h1>
                            </div>
                        </div>
                        <div className="card bg-warning card-border shadow-accent  hover:cursor-pointer hover:bg-neutral-500" onClick={() => router.push((`/main_navigation/logs?${urlDeviceFilter}&${urlUserFilter}&type=BATERIA`))}>
                            <div className="card-body">
                                <h1 className="card-title justify-start ">Aviso Batería: {batteryWarningCount}</h1>
                            </div>
                        </div>
                        <div className="card bg-error card-border shadow-accent  hover:cursor-pointer hover:bg-neutral-500" onClick={() => router.push(`/main_navigation/logs?${urlDeviceFilter}&${urlUserFilter}&type=DETECCION`)}>
                            <div className="card-body">
                                <h1 className="card-title justify-start ">Detecciones: {detectCount}</h1>
                            </div>
                        </div>
                    </div >
                    {error &&
                        <p className="justify-end text-end text-error text-bold text-xl">{error}</p>
                    }
                </div >
            }
        </>

    )
}
