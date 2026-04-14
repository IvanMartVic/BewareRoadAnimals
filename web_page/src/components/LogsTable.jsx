"use client"
export default function LogsTable({ logs, selectedRow, onSelect }) {
    return (
        <div className="overflow-auto h-full w-full rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
                <thead>
                    <tr>
                        <th>Timestamp</th>
                        <th>message</th>
                        <th>type</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((l, index) => {
                        return (<tr key={l.id}
                            onClick={() => onSelect?.(l.id)}
                            className={`${selectedRow == l.id ? "bg-neutral-500" : "bg-base-100"} hover:bg-base-300`}>
                            <th>{l.timestamp.toISOString()}</th>
                            <td>{l.message}</td>
                            <td>{l.type}</td>

                        </tr>);
                    })}

                </tbody>
            </table>

        </div>

    );

}
