"use client"
import LogsTable from "@/components/LogsTable"
// import { getAllLogs } from "@/services/logsService";
import useLogStore from "@/stores/logStore";
import useAuthStore from "@/stores/authStore";
// import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { use } from "react";
import { useRouter } from "next/navigation";
export default function LogViewPage({ searchParams }) {
    // http://localhost:3000/main_navigation/devices/logs?type=hola&deviceId=2 for type="hola" and deviceId="2"
    let filters = use(searchParams);
    const type = filters.type;
    const deviceId = filters.deviceId;
    const userId = filters.userId;
    const [selectedRow, setSelectedRow] = useState(null);
    // const logs = await getAllLogs();
    const { logs, fetchLogs, isLoading, deleteAllLogs } = useLogStore(
        useShallow((state) => ({
            logs: state.logs,
            fetchLogs: state.fetchLogs,
            isLoading: state.isLoading,
            deleteAllLogs: state.deleteAllLogs,
        }))
    );
    const { authUserId, fetchAuthUser, authUserData } = useAuthStore(
        useShallow((state) => ({
            authUserId: state.userId,
            fetchAuthUser: state.fetchAuthUser,
            authUserData: state.authUserData,
        }))
    );
    const [filter, setFilter] = useState({
        deviceId: (deviceId) ? +deviceId : "ALL",
        type: (type) ? type : "ALL",
        userId: (userId) ? +userId : authUserId,
    });
    const filterAndFetch = useCallback(() => {
        const queryFilter = { ...filter };
        if (queryFilter.type == "ALL") {
            delete queryFilter.type;
        }
        if (queryFilter.deviceId == "ALL") {
            delete queryFilter.deviceId;
        }
        if (queryFilter.userId == "ALL") {
            delete queryFilter.userId;
        }
        fetchLogs(queryFilter);

    }, [fetchLogs, filter]);

    useEffect(() => {
        filterAndFetch();
    }, [filterAndFetch]);
    useEffect(() => {
        fetchAuthUser();
    }, [fetchAuthUser]);

    // <div className="flex w-1/4">
    //     {selectedRow &&
    //         <LogDetails log={logs.find((l => l.id == selectedRow))}> </LogDetails>}
    //     </div>

    const router = useRouter();
    return (
        <div
            className="flex flex-col h-screen items-start p-10">
            <div className="flex w-full gap-2 justify-between">
                <div className="flex flex-row w-full gap-4 justify-start items-start">
                    <fieldset className="fieldset w-1/12">
                        <legend className="fieldset-legend">Tipo de log</legend>
                        <select value={filter.type} onChange={(e) => setFilter({ ...filter, type: e.target.value })} className="select ">
                            <option disabled={false}>ALL</option>
                            <option>SISTEMA</option>
                            <option>BATERIA</option>
                            <option>DETECCION</option>
                        </select>
                    </fieldset>
                    <fieldset className="fieldset w-1/12">
                        <legend className="fieldset-legend">Usuario</legend>
                        <select value={filter.userId} onChange={(e) => setFilter({ ...filter, userId: ("ALL" == e.target.value) ? e.target.value : +e.target.value })} className="select ">
                            <option value={authUserId} disabled={false}>Mi usuario</option>
                            {authUserData && authUserData.role == "ADMIN" &&
                                <option value={"ALL" || ""} disabled={false}>ALL</option>
                            }

                            {userId && userId != authUserId &&
                                <option value={+userId} disabled={false}>Usuario: ID={userId}</option>
                            }
                        </select>
                    </fieldset>

                </div>
                <div className="flex w-1/12 items-end">
                    <button className="btn btn-secondary w-full mb-1" onClick={() => filterAndFetch()}>Recargar</button>
                </div>
            </div>

            <div className="flex h-[90vh] w-full">
                <LogsTable logs={logs} selectedRow={selectedRow} onSelect={(r) => router.push(`/main_navigation/logs/${r}`)}></LogsTable>

            </div>

        </div>
    );


}
