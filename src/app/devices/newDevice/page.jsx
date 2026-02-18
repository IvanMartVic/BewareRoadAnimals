"use client"
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import CoordinatesIput from "../../../components/coordinatesInput";
import { createDevice } from "@/services/deviceService"

export default function NewDevicePage() {
    const router = useRouter();
    const [coordinates, setCoordinates] = useState("");
    const [deployedBy, setDeployedBy] = useState(0);
    const handleSubmit = async (e) => {
        if (e && e.preventDefault) {
            e.preventDefault();
        }
        // const device = createDevice(deployedBy, coordinates);
        
        const coords = coordinatesRef.current.getCoordenates();
        alert(`${deployedBy} ${coords}`);
        

    }
    const checkboxChanged = (e) => {
        setAdmin(e.target.checked);
    }
    const coordinatesRef = useRef();
    return (
        <div className="flex justify-start items-start ml-40 p-10 h-screen">
            <form onSubmit={handleSubmit}>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4 gap-7">
                    <legend className="fieldset-legend text-xl">Nuevo Dispositivo</legend>
                    <legend className="input validator">
                        <input placeholder="Desplegado por" 
                            pattern="[1-9][0-9]*" 
                            minLength="1"
                            onChange={(e) => setDeployedBy(e.target.value)}></input>
                        <p className="validator-hint hidden">inserte un id válido</p>
                    </legend>
                    <CoordinatesIput ref={coordinatesRef}></CoordinatesIput>
                    <button type="submit" className="btn btn-neutral mt-4">Añadir</button>
                </fieldset>
            </form>

        </div>
    );
}

