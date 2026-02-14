"use server"
import UsersTable from "../../components/UsersTable";
import { getAllUsers } from "../../services/userService";

export default async function UsersMainPage() {
    const users = await getAllUsers();
    return (
        <div
            className="flex flex-col gap-4 justify-start items-start h-screen p-10">
            <label className="input">
                <svg className="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g
                        strokeLinejoin="round"
                        strokeLinecap="round"
                        strokeWidth="2.5"
                        fill="none"
                        stroke="currentColor"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input type="search" required placeholder="Buscar" />
            </label>
            <UsersTable users={users}></UsersTable>
        </div>
    );

}
