"use client"
import { useEffect, useState } from "react";
import SearchBar from "@/components/searchBar";
import LogsTable from "@/components/LogsTable";
import Image from "next/image";
import papelera from "@/../public/papelera.jpg";
import plus from "@/../public/plus_icon.jpg";
import log_icon from "@/../public/log_icon.jpg";
import { useRouter } from "next/navigation";
import useLogStore from "@/stores/logStore";
import { useShallow } from "zustand/shallow";
import { useParams } from "next/navigation";


export default function LogsMainPage() {
    const { deviceId } = useParams();
    const [selectedId, setSelectedId] = useState(null);
    const { fetchLogs, fetchDeviceLogs, logs, deleteLog, deleteAllLogs } = useLogStore(
        useShallow((state => ({
            logs: state.logs,
            fetchLogs: state.fetchLogs,
            fetchDeviceLogs: state.fetchDeviceLogs,
            deleteLog: state.deleteLog,
            deleteAllLogs: state.deleteAllLogs,
        })))
    );
    const refreshLogs = () => {
        if(deviceId != "null"){
            fetchDeviceLogs(+deviceId);
        }else{
            fetchLogs();
        }
    };

    useEffect(() => {
        if(deviceId != "null"){
            fetchDeviceLogs(+deviceId);
        }else{
            fetchLogs();
        }
    }, [fetchDeviceLogs, fetchLogs, deviceId]);

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
        alert(JSON.stringify(logs));
    }
    function handleSelect(newId) {
        if (selectedId == newId) {
            setSelectedId(null);
        } else {
            setSelectedId(newId);
        }
    }

    async function deleteSelectedLog() {
        const log = await deleteLog(selectedId);
        refreshLogs();
    }
    async function deleteUserLogs(){
        deleteAllLogs();
    }


    const router = useRouter();
    return (
        <div
            className="flex flex-col gap-4 justify-start items-start h-screen p-10">
            <h1 className="text-2xl text-bold"></h1>
            <div className="flex flex-row gap-4">
                <SearchBar onSearch={handleSearch}></SearchBar>
                <div role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full" onClick={deleteSelectedLog}>
                        <Image src={papelera} alt=""></Image>
                    </div>
                </div>
                <div role="button" className="btn btn-ghost btn-circle avatar" onClick={deleteAllLogs}>
                    <div className="w-10 rounded-full">
                        <Image src={plus} alt=""></Image>
                    </div>
                </div>
            </div>
            <LogsTable logs={logs} selectedRow={selectedId} onSelect={handleSelect}></LogsTable>
        </div>
    );

}

