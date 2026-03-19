"use client"
import { useEffect, useState } from "react";
import SearchBar from "@/components/searchBar";
import UsersTable from "@/components/UsersTable";
import Image from "next/image";
import papelera from "@/../public/papelera.jpg";
import plus from "@/../public/plus_icon.jpg";
import lapiz from "@/../public/lapiz.png";
import { useRouter } from "next/navigation";
import  useUserStore  from "@/stores/userStore";
import { useShallow } from "zustand/shallow";


export default function UsersMainPage() {
    // const [users, setUsers] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    // useEffect(() => {
    //     getAllUsers().then((data) => setUsers(data));
    // }, [setUsers]);
    const { users, fetchUsers, deleteUser } = useUserStore(
        useShallow((state) => ({
            users: state.users,
            fetchUsers: state.fetchUsers,
            deleteUser: state.deleteUser,
        }))
    );
    useEffect(() => {
        fetchUsers();
    },[fetchUsers])

    async function handleSearch({ searchInput }) {
        // if (searchInput) {
        //     const onlyUser = [];
        //     const user = await getUserById(+searchInput);
        //     if (user) {
        //         onlyUser.push(user);
        //     }
        //     // setUsers(onlyUser);
        // } else {
        //     // const allUsers = await getAllUsers();
        //     // setUsers(allUsers);
        // }
        alert(JSON.stringify(users));
    }
    function handleSelect(newId) {
        if (selectedId == newId) {
            setSelectedId(null);
        } else {
            setSelectedId(newId);
        }
    }

    async function deleteSelectedUser() {
        const user = await deleteUser(selectedId);
        alert(`usuario ${user.full_name} eliminado`);
    }


    const router = useRouter();
    return (
        <div
            className="flex flex-col gap-4 justify-start items-start h-screen p-10">
            <h1 className="text-2xl text-bold">Usuarios registrados</h1>
            <div className="flex flex-row gap-4">
                <SearchBar onSearch={handleSearch}></SearchBar>
                <div role="button" className="btn btn-ghost btn-circle avatar" onClick={deleteSelectedUser}>
                    <div className="w-10 rounded-full">
                        <Image src={papelera} alt=""></Image>
                    </div>
                </div>
                <div role="button" className="btn btn-ghost btn-circle avatar" onClick={() => router.push("/main_navigation/users/newUser")}>
                    <div className="w-10 rounded-full">
                        <Image src={plus} alt=""></Image>
                    </div>
                </div>
                <div role="button" className="btn btn-ghost btn-circle avatar" onClick={() => router.push(`/main_navigation/users/updateUser/${selectedId}`)}>
                    <div className="w-10 rounded-full">
                        <Image src={lapiz} alt=""></Image>
                    </div>
                </div>
            </div>
            <UsersTable users={users} selectedRow={selectedId} onSelect={handleSelect}></UsersTable>
        </div>
    );

}
