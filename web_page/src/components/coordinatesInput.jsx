"use client"
import { useState, useImperativeHandle, useEffect, useCallback, useMemo } from "react"
export default function CoordinatesIput({ setMarkerPosition, markerPosition }) {
    function convertFloatToCoords(grad_float) {
        const gradAbs = Math.abs(grad_float);
        const grad = Math.floor(gradAbs);
        let sec = (gradAbs - grad) * 3600;
        let min = Math.floor(sec / 60);
        sec = (sec % 60).toFixed(2);
        return { grad, min, sec };
    }
    function convertCoordsToFloat(grad, min, sec) {
        return grad + min / 60 + sec / 3600;

    }
    const syncMapToInput = useCallback((latlng) => {
        const { grad: latG, min: latM, sec: latS } = convertFloatToCoords(+latlng[0]);
        const latO = (+latlng[0] > 0) ? "N" : "S";
        const { grad: lngG, min: lngM, sec: lngS } = convertFloatToCoords(+latlng[1]);
        const lngO = (+latlng[1] > 0) ? "E" : "O";
        return {
            latG: latG, latM: latM, latS: latS, latO: latO,
            lngG: lngG, lngM: lngM, lngS: lngS, lngO: lngO
        }
    }, [
    ]);
    const coords= useMemo(() => markerPosition ? syncMapToInput(markerPosition) : {
        latG: 0, latM: 0, latS: 0, latO: "N",
        lngG: 0, lngM: 0, lngS: 0, lngO: "E",
    }, [syncMapToInput, markerPosition]);
    // const [coords, setCoords] = useState(markerCoords);


    const getCoordenates = useCallback(() => {
        let latitude = convertCoordsToFloat(+coords.latG, +coords.latM, +coords.latS)
        latitude = (coords.latO == "N") ? latitude : -latitude;
        let length = convertCoordsToFloat(+coords.lngG, +coords.lngM, +coords.lngS)
        length = (coords.lngO == "E") ? length : -length;
        return [latitude, length]
    }, [coords]);



    // useEffect(() => {
    //     setMarkerPosition(getCoordenates());
    // }, [setMarkerPosition, getCoordenates])
    function changeMarker() {
        setMarkerPosition(getCoordenates());
    }
    function fetchCoords() {
        setCoords(markerCoords);
    }




    return (
        <div>
            <label className="label text-xl">Coordenadas</label>
            <div className="flex-col ml-5">
                <legend className="label">Latitud</legend>
                <div className="flex flex-row w-full justify-between">
                    <legend>
                        <input className="input w-12" disabled={true} value={coords.latG} onChange={(e) => setCoords({ ...coords, latG: e.target.value })}></input>
                        <label>º</label>
                    </legend>
                    <legend>
                        <input className="input w-12" disabled={true} value={coords.latM} onChange={(e) => setCoords({ ...coords, latM: e.target.value })}></input>
                        <label>'</label>
                    </legend>
                    <legend>
                        <input className="input w-18" disabled={true} value={coords.latS} onChange={(e) => setCoords({ ...coords, latS: e.target.value })}></input>
                        <label>''</label>
                    </legend>
                    <select className="select w-15" disabled={true} value={coords.latO} onChange={(e) => setCoords({ ...coords, latO: e.target.value })}>
                        <option value="N">N</option>
                        <option value="S">S</option>
                    </select>
                </div>
                <legend className="label">Longitud</legend>
                <div className="flex flex-row w-full justify-between">
                    <legend>
                        <input className="input w-12 " disabled={true} value={coords.lngG} onChange={(e) => setCoords({ ...coords, lngG: e.target.value })}></input>
                        <label>º</label>
                    </legend>
                    <legend>
                        <input className="input w-12 " disabled={true} value={coords.lngM} onChange={(e) => setCoords({ ...coords, lngM: e.target.value })}></input>
                        <label>'</label>
                    </legend>
                    <legend>
                        <input className="input w-18 " disabled={true} value={coords.lngS} onChange={(e) => setCoords({ ...coords, lngS: e.target.value })}></input>
                        <label>''</label>
                    </legend>
                    <select className="select w-15" disabled={true} value={coords.lngO} onChange={(e) => setCoords({ ...coords, lngO: e.target.value })}>
                        <option value="E">E</option>
                        <option value="O">O</option>
                    </select>
                </div>
            </div>
        </div>

    )


}
