export default function LogsTable({ logs, selectedRow, onSelect }) {
    return (
        <div className="overflow-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Device Id</th>
                        <th>message</th>
                        <th>imagen Asociada</th>
                    </tr>
                </thead>
                <tbody>
                    {logs.map((l, index) => {
                        return (<tr key={l.id}
                            onClick={() => onSelect(l.id)}
                            className={`${selectedRow == l.id ? "bg-neutral-500" : "bg-base-100"} hover:bg-base-300`}>
                            <th>{l.id}</th>
                            <td>{l.deviceId}</td>
                            <td>{l.message}</td>
                            <td>{l.imagen == ""? l.imagen:"Sin Imagen"}</td>

                        </tr>);
                    })}

                </tbody>
            </table>

        </div>

    );

}
