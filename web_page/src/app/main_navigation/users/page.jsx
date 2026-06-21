"use client"
import { useEffect, useState } from "react";
import SearchBar from "@/components/searchBar";
import UsersTable from "@/components/UsersTable";
import Image from "next/image";
import papelera from "@/../public/papelera.jpg";
import plus from "@/../public/plus_icon.jpg";
import lapiz from "@/../public/lapiz.png";
import { useRouter } from "next/navigation";
import useUserStore from "@/stores/userStore";
import { useShallow } from "zustand/shallow";


export default function UsersMainPage() {
    // const [users, setUsers] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    // useEffect(() => {
    //     getAllUsers().then((data) => setUsers(data));
    // }, [setUsers]);
    const { users, fetchUsers, deleteUser, searchAndFetchUsers } = useUserStore(
        useShallow((state) => ({
            users: state.users,
            fetchUsers: state.fetchUsers,
            deleteUser: state.deleteUser,
            searchAndFetchUsers: state.searchAndFetchUsers,
        }))
    );
    useEffect(() => {
        fetchUsers();
    }, [fetchUsers])

    async function handleSearch({ searchInput }) {
        if (searchInput) {
            searchAndFetchUsers(searchInput);
        } else {
            fetchUsers();
        }
    }
    function handleSelect(newId) {
        router.push(`/main_navigation/users/updateUser/${newId}`);
    }

    const router = useRouter();
    return (
        <div
            className="flex flex-col gap-4 justify-start items-start h-screen p-10">
            <h1 className="text-2xl text-bold">Usuarios registrados</h1>
            <div className="flex flex-row gap-4 justify-between w-full">
                <SearchBar onSearch={handleSearch}></SearchBar>
                <div role="button" className="btn btn-ghost btn-circle avatar" onClick={() => router.push("/main_navigation/users/newUser")}>
                    <div className="w-10 rounded-full">
                        <Image src={plus} alt=""></Image>
                    </div>
                </div>
            </div>
            <UsersTable users={users} selectedRow={selectedId} onSelect={handleSelect}></UsersTable>
        </div>
    );

}
