"use client"
import { useState, useImperativeHandle } from "react"
export default function CoordinatesIput({ref}) {
    const [latitudeGrad, setLatitudeGrad] = useState(0)
    const [latitudeMinute, setLatitudeMinute] = useState(0)
    const [latitudeSecond, setLatitudeSecond] = useState(0)
    const [lenghtGrad, setLenghtGrad] = useState(0)
    const [lenghtMinute, setLenghtMinute] = useState(0)
    const [lenghtSecond, setLenghtSecond] = useState(0)

    useImperativeHandle(ref, () => ({
        getCoordenates: () => {
            return `${latitudeGrad}º ${latitudeMinute}' ${latitudeSecond}'' ${lenghtGrad}º ${lenghtMinute}' ${lenghtSecond}''`;
        }
    }));



    return (
        <>
            <label className="label text-xl">Coordenadas</label>
            <div className="flex-col ml-5">
                <legend className="label">Latitud</legend>
                <div className="flex flex-row w-full justify-between">
                    <legend>
                        <input className="input w-12 mr-2" onChange={(e) => setLatitudeGrad(e.target.value)}></input>
                        <label>º</label>
                    </legend>
                    <legend>
                        <input className="input w-12 mr-2" onChange={(e) => setLatitudeMinute(e.target.value)}></input>
                        <label>'</label>
                    </legend>
                    <legend>
                        <input className="input w-12 mr-2" onChange={(e) => setLatitudeSecond(e.target.value)}></input>
                        <label>''</label>
                    </legend>
                    <select className="select w-15">
                        <option>N</option>
                        <option>S</option>
                    </select>
                </div>
                <legend className="label">Longitud</legend>
                <div className="flex flex-row w-full justify-between">
                    <legend>
                        <input className="input w-12 mr-2" onChange={(e) => setLenghtGrad(e.target.value)}></input>
                        <label>º</label>
                    </legend>
                    <legend>
                        <input className="input w-12 mr-2" onChange={(e) => setLenghtMinute(e.target.value)}></input>
                        <label>'</label>
                    </legend>
                    <legend>
                        <input className="input w-12 mr-2" onChange={(e) => setLenghtSecond(e.target.value)}></input>
                        <label>''</label>
                    </legend>
                    <select className="select w-15">
                        <option>O</option>
                        <option>E</option>
                    </select>
                </div>
            </div>
        </>

    )


}
