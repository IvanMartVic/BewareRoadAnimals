"use client"
import LogsTable from "@/components/LogsTable"
// import { getAllLogs } from "@/services/logsService";
import useLogStore from "@/stores/logStore";
// import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import SearchBar from "@/components/searchBar";
import LogDetails from "@/components/LogDetails";
import { use } from "react";
export default function LogViewPage({searchParams}) {
    // http://localhost:3000/main_navigation/devices/logs?type=hola&deviceId=2 for type="hola" and deviceId="2"
    let filters = use(searchParams);
    const type = filters.type;
    const deviceId = filters.deviceId;
    const [selectedRow, setSelectedRow] = useState(null);
    const [filter, setFilter] = useState({
        deviceId: (deviceId) ? +deviceId: "ALL",
        type:(type) ? type : "ALL",
    });
    // const logs = await getAllLogs();
    const { logs, fetchLogs, isLoading, deleteAllLogs } = useLogStore(
        useShallow((state) => ({
            logs: state.logs,
            fetchLogs: state.fetchLogs,
            isLoading: state.isLoading,
            deleteAllLogs: state.deleteAllLogs,
        }))
    );

    useEffect(() => {
        const queryFilter = {...filter};
        if(queryFilter.type == "ALL"){
            delete queryFilter.type;
        }
        if(queryFilter.deviceId== "ALL"){
            delete queryFilter.deviceId;
        }
        fetchLogs(queryFilter);
    }, [fetchLogs, filter]);


    return (
        <div
            className="flex flex-col h-screen w-screen gap-4 p-10">
            <div className="flex flex-row w-screen gap-1">
                <SearchBar onSearch={() => alert("hola")}></SearchBar>
                <button className="btn btn-soft btn-accent" onClick={async () => await fetchLogs({deviceId:+deviceId})}>Recargar</button>
            </div>
            <div className="flex h-[90vh] w-full">
                <div className="flex w-[60vw]">
                    <LogsTable logs={logs} selectedRow={selectedRow} onSelect={(r) => setSelectedRow(r)}></LogsTable>
                </div>
                <div className="flex w-1/4">
                    {selectedRow && 
                    <LogDetails log={logs.find((l => l.id == selectedRow))}> </LogDetails>}
                </div>

            </div>

        </div>
    );


}
