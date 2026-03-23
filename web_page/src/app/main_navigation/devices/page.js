"use client"
import { useEffect, useState } from "react";
import SearchBar from "@/components/searchBar";
import DevicesTable from "@/components/DeviceTable";
import Image from "next/image";
// import { getAllUsers, getUserById, deleteUser } from "@/services/userService";
import papelera from "@/../public/papelera.jpg";
import plus from "@/../public/plus_icon.jpg";
import log_icon from "@/../public/log_icon.jpg";
import { useRouter } from "next/navigation";
import useDeviceStore from "@/stores/deviceStore";
import { useShallow } from "zustand/shallow";


export default function DevicesMainPage() {
    const [users, setUsers] = useState([]);
    const [selectedId, setSelectedId] = useState(null);
    const { fetchDevices, isLoading, devices, deleteDevice, error} = useDeviceStore(
        useShallow((state) => ({
            fetchDevices: state.fetchDevices,
            isLoading: state.isLoading,
            devices: state.devices,
            deleteDevice: state.deleteDevice,
            error:state.error,
        })));
    useEffect(() => {
        fetchDevices();
        if(error != null){
            alert(error);
        }
    }, [fetchDevices, error]);

    async function handleSearch({ searchInput }) {
        // if (searchInput) {
        //     const onlyUser = [];
        //     const user = await getUserById(+searchInput);
        //     if (user) {
        //         onlyUser.push(user);
        //     }
        //     setUsers(onlyUser);
        // } else {
        //     const allUsers = await getAllUsers();
        //     setUsers(allUsers);
        // }
        alert(JSON.stringify(devices));
    }
    function handleSelect(newId) {
        if (selectedId == newId) {
            setSelectedId(null);
        } else {
            setSelectedId(newId);
        }
    }

    async function deleteSelectedDevice() {
        const device = await deleteDevice(selectedId);
        alert(`dispositivo ${device.id} eliminado`);
    }


    const router = useRouter();
    return (
        <div
            className="flex flex-col gap-4 justify-start items-start h-screen p-10">
            <h1 className="text-2xl text-bold"></h1>
            <div className="flex flex-row gap-4">
                <SearchBar onSearch={handleSearch}></SearchBar>
                <div role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full" onClick={deleteSelectedDevice}>
                        <Image src={papelera} alt=""></Image>
                    </div>
                </div>
                <div role="button" className="btn btn-ghost btn-circle avatar" onClick={() => router.push("/main_navigation/devices/newDevice")}>
                    <div className="w-10 rounded-full">
                        <Image src={plus} alt=""></Image>
                    </div>
                </div>
                <div role="button" className="btn btn-ghost btn-circle avatar" onClick={() => router.push(`/main_navigation/devices/logs/${selectedId}`)}>
                    <div className="w-10 rounded-full">
                        <Image src={log_icon} alt=""></Image>
                    </div>
                </div>
            </div>
            <DevicesTable devices={devices} selectedRow={selectedId} onSelect={handleSelect}></DevicesTable>
        </div>
    );

}
