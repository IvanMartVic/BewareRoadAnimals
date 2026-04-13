"use client"
import useLogStore from "@/stores/logStore"
import { useEffect } from "react";
import { useShallow } from "zustand/shallow"

export default function LogsOverview() {
    const { fetchLogTypeCount, logCount, systemCount, detectCount, batteryWarningCount, isLoading } = useLogStore(
        useShallow((s) => ({
            fetchLogTypeCount: s.fetchLogTypeCount,
            logCount : s.logCount ,
            systemCount: s.systemCount,
            detectCount: s.detectCount,
            batteryWarningCount: s.batteryWarningCount,
            isLoading: s.isLoading,
        })));
    useEffect( () => {
        fetchLogTypeCount?.();
    }, [fetchLogTypeCount])

    return (
        < div className="flex flex-row gap-8 h-1/5 w-full justify-between items-start" >
            <div className="card bg-neutral  card-border shadow-accent w-1/5 hover:cursor-pointer hover:bg-neutral-500">
                <div className="card-body">
                        <h1 className="card-title justify-start text-neutral-content">Logs: {logCount}</h1>
                </div>
            </div>
            <div className="card bg-base-300 card-border shadow-accent w-1/5 hover:cursor-pointer hover:bg-neutral-500">
                <div className="card-body">
                    <h1 className="card-title justify-start ">Detecciones: {detectCount}</h1>
                </div>
            </div>
            <div className="card bg-base-300 card-border shadow-accent w-1/5 hover:cursor-pointer hover:bg-neutral-500">
                <div className="card-body">
                    <h1 className="card-title justify-start ">Sistema: {systemCount}</h1>
                </div>
            </div>
            <div className="card bg-warning card-border shadow-accent w-1/5 hover:cursor-pointer hover:bg-primary">
                <div className="card-body">
                    <h1 className="card-title justify-start ">Aviso Batería: {batteryWarningCount}</h1>
                </div>
            </div>

        </div >

    )
}
