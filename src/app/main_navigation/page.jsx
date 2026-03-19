"use client"
import { useMemo } from "react";
import dynamic from "next/dynamic";

export default function Home() {
    const Map = useMemo(() => dynamic(
        () => import('@/components/DeviceMap'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    return (
        <div
            className="flex h-screen justify-between items-center p-20">
            <h1 className="text-9xl">Hola mundo</h1>
            <Map position={[40.96882, -5.66388]} zoom={13}/>
        </div>
    );
}
