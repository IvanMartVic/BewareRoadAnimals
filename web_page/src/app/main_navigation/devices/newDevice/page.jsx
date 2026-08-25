"use client"
import { useRef, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import CoordinatesIput from "@/components/coordinatesInput";
import useDeviceStore from "@/stores/deviceStore"
import useAuthStore from "@/stores/authStore"
import { useShallow } from "zustand/shallow";
import { useModal } from "@/context/AlertContext"
import crypto from "crypto"


export default function NewDevicePage() {
    const router = useRouter();
    const SALAMANCA_POS = [40.96882, -5.66388];
    const addDevice = useDeviceStore((state) => (state.addDevice));
    const { authUserData, fetchAuthUser } = useAuthStore(
        useShallow((state) => ({
            authUserData: state.authUserData,
            fetchAuthUser: state.fetchAuthUser,
        }))
    );

    useEffect(() => {
        fetchAuthUser();
    }, [fetchAuthUser])

    const [markerPosition, setMarkerPosition] = useState(SALAMANCA_POS);
    const markerRef = useRef(null);

    const { showAlert } = useModal();
    const deployToken = useMemo(() => crypto.randomBytes(32).toString('hex'), [])

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (authUserData) {
            const latitude = markerPosition[0];
            const length = markerPosition[1];

            await addDevice({ userId: authUserData.id, coordLatitude: latitude, coordLength: length, deployToken: deployToken });
            await showAlert({ message: `dispositivo desplegado en ${latitude} ${length} por ${authUserData.full_name}. \n Token de despliegue: ${deployToken}` });
            router.push("/main_navigation/devices");
        }
    }
    const Map = useMemo(() => dynamic(
        () => import('@/components/DeviceInputMap'),
        {
            loading: () => <p>A map is loading</p>,
            ssr: false
        }
    ), [])

    return (
        <div className="relative w-full h-screen">
            {/* El mapa ocupa todo el contenedor */}
            <div className="w-full h-[95vh]">
                <Map position={SALAMANCA_POS} markerPosition={markerPosition} scrollWheelZoom={true} setMarkerPosition={setMarkerPosition} markerRef={markerRef} zoom={8} />
            </div>

            {/* Formulario flotante superpuesto */}
            <form onSubmit={handleSubmit} className="absolute top-4 right-4 z-[1000] max-w-sm">
                <fieldset className="flex flex-col fieldset bg-base-200/90 backdrop-blur-sm border-base-300 md:w-60 rounded-box w-full border p-4 gap-4 shadow-xl">
                    <legend className="fieldset-legend text-xl text-primary font-bold">Nuevo Dispositivo</legend>

                    <label className="label">Desplegado por</label>
                    <legend className="input">
                        <input
                            value={authUserData?.full_name ?? "desconocido"}
                            disabled
                        />
                    </legend>

                    <label className="label">Token de despliegue</label>
                    <legend className="input">
                        <input
                            value={deployToken}
                            disabled
                        />
                    </legend>

                    <CoordinatesIput setMarkerPosition={setMarkerPosition} markerPosition={markerPosition} />

                    <button type="submit" className="btn btn-primary mt-2">Añadir</button>
                </fieldset>
            </form>
        </div>
    );
}

