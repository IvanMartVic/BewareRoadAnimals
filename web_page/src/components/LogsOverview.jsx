"use client"
import useLogStore from "@/stores/logStore"
import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow"

const DEFAULT_FILTERS = {}
export default function LogsOverview({ filters = DEFAULT_FILTERS }) {
    const { fetchLogTypeCount, logCount, systemCount, detectCount, batteryWarningCount, isLoading, error} = useLogStore(
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
        fetchLogTypeCount?.(filters);
    }, [fetchLogTypeCount, filters])
    const router = useRouter();
    const urlDeviceFilter = filters.deviceId ? `deviceId=${filters.deviceId}`: "";

    return (
        < div className="flex flex-row gap-8 h-1/5 w-full justify-between items-start" >
            <div className={`card bg-neutral  card-border shadow-accent w-1/5 hover:cursor-pointer hover:bg-neutral-500`} onClick={() => router.push(`/main_navigation/devices/logs?${urlDeviceFilter}`)}>
                <div className="card-body">
                    <h1 className="card-title justify-start text-neutral-content">Logs: {logCount}</h1>
                </div>
                {error && 
                    <p className="justify-end text-end text-error text-bold text-xl">{error}</p>
                }
            </div>

            <div className="card bg-base-300 card-border shadow-accent w-1/5 hover:cursor-pointer hover:bg-neutral-500" onClick={() => router.push(`/main_navigation/devices/logs?type=SISTEMA&${urlDeviceFilter}`)}>
                <div className="card-body">
                    <h1 className="card-title justify-start ">Sistema: {systemCount}</h1>
                </div>
            </div>
            <div className="card bg-warning card-border shadow-accent w-1/5 hover:cursor-pointer hover:bg-primary" onClick={() => router.push((`/main_navigation/devices/logs?type=BATERIA&${urlDeviceFilter}`))}>
                <div className="card-body">
                    <h1 className="card-title justify-start ">Aviso Batería: {batteryWarningCount}</h1>
                </div>
            </div>
            <div className="card bg-error card-border shadow-accent w-1/5 hover:cursor-pointer hover:bg-neutral-500" onClick={() => router.push(`/main_navigation/devices/logs?type=DETECCION&${urlDeviceFilter}`)}>
                <div className="card-body">
                    <h1 className="card-title justify-start ">Detecciones: {detectCount}</h1>
                </div>
            </div>

        </div >

    )
}
