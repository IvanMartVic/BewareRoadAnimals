"use client"
// function loadUsers(){
//     const d = new Date().toLocaleString();
//     const User = { id: 1, full_name: "Pepe no existoArray", email: "inexistente@gmail", createdAt: d, role:"FANTASMA"};
//     const users = [];
//     for (let i = 0; i < 100; i++) {
//         users.push(User);
//     }
//     // console.log(users);
//     return users;
// }
export default function UsersTable({users}) {
    // const users = loadUsers();
    return (
        <div className="overflow-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
                <thead>
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
                        return (<tr key={index}>
                            <th>{index}</th>
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
