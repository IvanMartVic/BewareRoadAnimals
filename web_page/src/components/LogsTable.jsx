"use client"
export default function LogsTable({ logs, selectedRow, onSelect }) {
    return (
        <div className="overflow-auto h-full w-full rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
                <thead className="bg-primary text-primary-content">
                    <tr>
                        <th>Momento de la detección</th>
                        <th>Mensaje</th>
                        <th>Tipo</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((l, index) => {
                        return (<tr key={l.id}
                            onClick={() => onSelect?.(l.id)}
                            className={`${selectedRow == l.id ? "bg-neutral-500" : "bg-base-100"} hover:bg-base-300`}>
                            <th>{l.timestamp.toLocaleString()}</th>
                            <td>{l.message}</td>
                            <td>{l.type}</td>

                        </tr>);
                    })}

                </tbody>
            </table>

        </div>

    );

}
