"use client"
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import CoordinatesIput from "@/components/coordinatesInput";
import { createDevice } from "@/services/deviceService"
import { getAuthUser } from "@/services/authenticationService"
import useDeviceStore from "@/stores/deviceStore"

export default function NewDevicePage() {
    const router = useRouter();
    const [coordinates, setCoordinates] = useState("");
    const [userData, setUserData] = useState(null);
    const addDevice = useDeviceStore((state) => (state.addDevice));

    useEffect(() => {
        getAuthUser().then((user) => setUserData(user));
    },[setUserData])

    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        // const device = createDevice(deployedBy, coordinates);

        const coords = coordinatesRef.current.getCoordenates();
        await addDevice({userId:userData.userId, coordinates:coords});
        alert(`${JSON.stringify(userData)} ${coords}`);
        router.push("/main_navigation/devices");

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
                            value={userData?.full_name ?? ""}
                            disabled
                        ></input>
                    </legend>
                    <CoordinatesIput ref={coordinatesRef}></CoordinatesIput>
                    <button type="submit" className="btn btn-neutral mt-4">Añadir</button>
                </fieldset>
            </form>

        </div>
    );
}

