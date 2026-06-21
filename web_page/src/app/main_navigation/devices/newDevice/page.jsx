"use client"
import { useRef, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import CoordinatesIput from "@/components/coordinatesInput";
import useDeviceStore from "@/stores/deviceStore"
import useAuthStore from "@/stores/authStore"
import { useShallow } from "zustand/shallow";
import { useModal } from "@/context/AlertContext"


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

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if (authUserData) {
            const latitude = markerPosition[0];
            const length = markerPosition[1];

            await addDevice({ userId: authUserData.id, coordLatitude: latitude, coordLength: length });
            await showAlert({ message: `dispositivo desplegado en ${latitude} ${length} por ${authUserData.full_name}` });
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
        <div className="flex justify-between items-start p-10 h-screen gap-7">
            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-s border p-4 gap-7">
                    <legend className="fieldset-legend text-xl text-primary">Nuevo Dispositivo</legend>
                    <label className="label ">Despliegado por</label>
                    <legend className="input">
                        <input
                            value={authUserData?.full_name ?? "desconocido"}
                            disabled
                        ></input>
                    </legend>
                    <CoordinatesIput setMarkerPosition={setMarkerPosition} markerPosition={markerPosition}></CoordinatesIput>
                    <button type="submit" className="btn btn-primary mt-4">Añadir</button>
                </fieldset>
            </form>
            <div className="h-[90vh] w-3/4">
                <Map position={SALAMANCA_POS} markerPosition={markerPosition} scrollWheelZoom={true} setMarkerPosition={setMarkerPosition} markerRef={markerRef} zoom={8} />

            </div>

        </div>
    );
}

