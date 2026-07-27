"use client"
import Link from "next/link";
import Image from "next/image";
import useLogStore from "@/stores/logStore";
import { useShallow } from "zustand/shallow";
import { useEffect, useMemo } from "react";
import Navbar from "@/components/navbar";
import dynamic from "next/dynamic";
import { DetectWarningNotification } from "@/components/detectWarningNotification";


export default function PresentationPage() {
    const { logs, fetchAndMonitorDetections, error } = useLogStore(useShallow((s) => ({
        logs: s.logs,
        fetchAndMonitorDetections: s.fetchAndMonitorDetections,
        error: s.error,
    })));
    useEffect(() => {
        fetchAndMonitorDetections();
    }, [fetchAndMonitorDetections]);
    const Map = useMemo(() => dynamic(
        () => import('@/components/LogsMap'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    return (
        <div className="flex-row w-full h-full bg-base-200">
            <Navbar />
            <div className="flex md:w-screen md:flex-row md:h-full bg-base-200 md:p-5 md:gap-4 md: justify-between">
                <div className="md:w-3/5 md:h-[90vh] md:bg-primary">
                    <Map position={[40.96882, -5.66388]} zoom={8} logs={logs} scrollWheelZoom={false} clickFunction={() => console.log("click")} />
                </div>
                <div className="flex flex-col md:w-1/3 md: h-full bg-secondary p-5 gap-4">
                    <h1 className="text-primary font-bold text-xl"> Detecciones última hora </h1>
                    {logs.map((l) => (<DetectWarningNotification key={l.id} detection={l} />))}
                </div>

            </div >
        </div>
    )



}
