"use client"

import { useState } from "react";

export default function DeviceTable({ devices, selectedRow, onSelect }) {
    return (
        <div className="overflow-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Coordenadas</th>
                        <th>Desplegado por</th>
                    </tr>
                </thead>
                <tbody>
                    {devices.map((d, index) => {
                        return (<tr key={d.id}
                            onClick={() => onSelect(d.id)}
                            className={`${selectedRow == d.id ? "bg-neutral-500" : "bg-base-100"} hover:bg-base-300`}>
                            <th>{d.id}</th>
                            <td>{`${(d.coordLatitude).toFixed(4)} ${d.coordLength.toFixed(4)}`}</td>
                            <td>{d.deployedBy.full_name}</td>
                        </tr>);
                    })}

                </tbody>
            </table>

        </div>

    );

}
