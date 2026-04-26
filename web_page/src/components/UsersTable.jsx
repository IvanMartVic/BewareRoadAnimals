"use client"


export default function UsersTable({users, selectedRow, onSelect}) {
    return (
        <div className="overflow-auto w-full rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
                <thead className="bg-primary text-primary-content">
                    <tr>
                        <th>id</th>
                        <th>Nombre y apellidos</th>
                        <th>email</th>
                        <th>rol</th>
                        <th>Fecha de alta de usuario</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u,index) => {
                        return (<tr key={u.id} 
                            onClick= { () => onSelect(u.id)}
                            className={`${selectedRow == u.id? "bg-neutral-400": "bg-base-100"} hover:bg-base-300`}>
                            <th>{u.id}</th>
                            <td>{u.full_name}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td>{u.createdAt.toLocaleString()}</td>
                        </tr>);

                    })}

                </tbody>

            </table>

        </div>

    );

}
