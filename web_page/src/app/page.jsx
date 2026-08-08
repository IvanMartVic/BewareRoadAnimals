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
            <Navbar isDrawerAbsolute={true}>
                <div className="flex flex-col-reverse md:w-screen md:flex-row md:h-full bg-base-200 md:p-0 md:justify-start">
                    <div className="md:w-4/5 md:h-[95vh] h-[80vh] md:bg-primary w-screen">
                        <Map position={[40.96882, -5.66388]} zoom={8} logs={logs} scrollWheelZoom={false} clickFunction={() => console.log("click")} />
                    </div>
                    <div className="flex flex-col md:w-1/5 h-[60vh] w-screen md:h-[95vh] bg-secondary p-5 gap-4">
                        <h1 className="text-primary font-bold text-xl"> Detecciones última hora </h1>
                        <div className="flex flex-col w-full h-full gap-4 overflow-auto">
                            {logs.map((l) => (<DetectWarningNotification key={l.id} detection={l} />))}

                        </div>
                    </div>

                </div >
            </Navbar>

        </div>
    )



}
