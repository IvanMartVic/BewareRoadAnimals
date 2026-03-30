"use client"
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import CoordinatesIput from "@/components/coordinatesInput";
import useDeviceStore from "@/stores/deviceStore"
import useAuthStore from "@/stores/authStore"
import { useShallow } from "zustand/shallow";

export default function NewDevicePage() {
    const router = useRouter();
    const addDevice = useDeviceStore((state) => (state.addDevice));
    const { authUserData, fetchAuthUser } = useAuthStore(
        useShallow((state) => ({
            authUserData: state.authUserData,
            fetchAuthUser: state.fetchAuthUser,
        }))
    );

    useEffect(() => {
        fetchAuthUser();
    },[fetchAuthUser])

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        if(authUserData){
            const {latitude, length}= coordinatesRef.current.getCoordenates();
            await addDevice({userId:authUserData.id, coordLatitude:latitude, coordLength:length});
            alert(`dispositivo desplegado en ${latitude} ${length} por ${authUserData.full_name}`);
            router.push("/main_navigation/devices");
        }
    }

    const coordinatesRef = useRef();
    return (
        <div className="flex justify-start items-start ml-40 p-10 h-screen">
            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 gap-7">
                    <legend className="fieldset-legend text-xl">Nuevo Dispositivo</legend>
                    <label className="label ">Despliegado por</label>
                    <legend className="input">
                        <input 
                            value={authUserData?.full_name ?? "desconocido"}
                            disabled
                        ></input>
                    </legend>
                    <CoordinatesIput ref={coordinatesRef}></CoordinatesIput>
                    <button type="submit" className="btn btn-primary mt-4">Añadir</button>
                </fieldset>
            </form>

        </div>
    );
}

