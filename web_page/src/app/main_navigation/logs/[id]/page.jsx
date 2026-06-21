"use client"
import useLogStore from "@/stores/logStore";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import LogDetails from "@/components/LogDetails"
import { useParams, useRouter } from "next/navigation";
import { useShallow } from "zustand/shallow";
import { useModal } from "@/context/AlertContext"

export default function LogDetailPage() {
    const { id } = useParams();
    const { logs, fetchLogs, isLoading, error } = useLogStore(
        useShallow((state) => ({
            logs: state.logs,
            fetchLogs: state.fetchLogs,
            isLoading: state.isLoading,
            error: state.error,
        }))
    );
    const router = useRouter();
    const log = useMemo(() => logs.find((l) => l.id === +id), [logs, id]);
    const { showAlert } = useModal();
    const fetchLogId = useCallback(async () => {
        const logs = await fetchLogs({ id: +id });
        if (logs && logs.length == 0) {
            await showAlert({ message: `error: no existe log con id:${id}`, title: "Oh ha ocurrido un error" });
            router.push("/main_navigation/logs");
        }
    }, [fetchLogs, id, router])

    useEffect(() => {
        if (!log && !isLoading) {
            fetchLogId();
        }
    }, [log, isLoading, fetchLogId]);


    return (
        <div className="flex justify-center items-start h-screen">
            {!isLoading && log ? (
                <div className="w-xl">
                    <LogDetails log={log} />
                </div>
            ) : (
                <>
                    <p>Cargando ...</p>
                    <p className="text-error">{error}</p>
                </>

            )}
        </div>
    );

}
