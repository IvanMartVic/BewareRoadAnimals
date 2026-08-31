"use client"
import LogsTable from "@/components/LogsTable"
import useLogStore from "@/stores/logStore";
import useAuthStore from "@/stores/authStore";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/shallow";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useModal } from "@/context/AlertContext"
export default function LogViewPage({ searchParams }) {
    // http://localhost:3000/main_navigation/devices/logs?type=hola&deviceId=2 for type="hola" and deviceId="2"
    let searchFilters = use(searchParams);
    const [selectedRow, setSelectedRow] = useState(null);
    const { logs, fetchLogsRT, fetchLogs, isLoading, deleteAllLogs } = useLogStore(
        useShallow((state) => ({
            logs: state.logs,
            fetchLogsRT: state.fetchLogsRT,
            isLoading: state.isLoading,
            deleteAllLogs: state.deleteAllLogs,
            fetchLogs: state.fetchLogs,
        }))
    );
    const { authUserId, fetchAuthUser, authUserData } = useAuthStore(
        useShallow((state) => ({
            authUserId: state.userId,
            fetchAuthUser: state.fetchAuthUser,
            authUserData: state.authUserData,
        }))
    );
    const [pageFilter, setFilter] = useState({
        deviceId: (searchFilters.deviceId) ? +searchFilters.deviceId : "ALL",
        type: (searchFilters.type) ? searchFilters.type : "ALL",
        userId: (searchFilters.userId),
    });
    const filterAndFetch = useCallback(() => {
        const queryFilter = {
            deviceId: (pageFilter.deviceId),
            type: (pageFilter.type),
            userId: (pageFilter.userId) ? (pageFilter.userId == "ALL" ? "ALL" : +pageFilter.userId) : authUserId,
        };
        if (queryFilter.type == "ALL") {
            delete queryFilter.type;
        }
        if (queryFilter.deviceId == "ALL") {
            delete queryFilter.deviceId;
        }
        if (queryFilter.userId == "ALL") {
            delete queryFilter.userId;
        }
        fetchLogsRT(queryFilter);

    }, [fetchLogsRT, fetchLogs, pageFilter.deviceId, pageFilter.type, pageFilter.userId, authUserId]);

    const { showConfirm } = useModal();
    const deleteFetchLogs = async () => {
        const choice = await showConfirm({ message: `vas a eliminar ${logs.length} logs`, title: "eliminar logs" });
        if (choice) {
            const queryFilter = { ...pageFilter };
            if (queryFilter.type == "ALL") {
                delete queryFilter.type;
            }
            if (queryFilter.deviceId == "ALL") {
                delete queryFilter.deviceId;
            }
            if (queryFilter.userId == "ALL") {
                delete queryFilter.userId;
            }
            await deleteAllLogs(queryFilter);
            filterAndFetch();
        }
    }
    const [userFetched, setUserFetched] = useState(false);
    useEffect(() => {
        fetchAuthUser().then(() => setUserFetched(true));
    }, [fetchAuthUser, setUserFetched]);

    // useEffect(() => {
    //     console.error(authUserId);
    // }, [authUserId])

    useEffect(() => {
        if (userFetched) {
            // console.error("calling filter and fetch")
            filterAndFetch();
        }
    }, [filterAndFetch, userFetched]);


    const router = useRouter();
    return (
        <div
            className="flex flex-col h-full items-start p-10">
            <div className="flex md:flex-row flex-col w-full gap-2 justify-between">
                <div className="flex md:flex-row flex-col w-full gap-4 justify-start items-start">
                    <fieldset className="fieldset w-full md:w-auto md:min-w-37.5">
                        <legend className="fieldset-legend">Tipo de log</legend>
                        <select value={pageFilter.type} onChange={(e) => setFilter({ ...pageFilter, type: e.target.value })} className="select ">
                            <option disabled={false} value={"ALL"}>TODOS</option>
                            <option>SISTEMA</option>
                            <option>BATERIA</option>
                            <option value={"DETECCION"}>DETECCIÓN</option>
                        </select>
                    </fieldset>
                    <fieldset className="fieldset w-full md:w-auto md:min-w-37.5">
                        <legend className="fieldset-legend">Usuario</legend>
                        <select value={pageFilter.userId} onChange={(e) => setFilter({ ...pageFilter, userId: ("ALL" == e.target.value) ? e.target.value : +e.target.value })} className="select ">
                            <option value={authUserId} disabled={false}>Mi usuario</option>
                            {authUserData && authUserData.role == "ADMIN" &&
                                <option value={"ALL" || ""} disabled={false}>TODOS</option>
                            }

                            {searchFilters.userId && searchFilters.userId != authUserId && searchFilters.userId != "ALL" &&
                                <option value={+searchFilters.userId} disabled={false}>Usuario: ID={searchFilters.userId}</option>
                            }
                        </select>
                    </fieldset>
                </div>
                <div className="flex flex-row w-full gap-4 items-end md:justify-end justify-between">
                    <button className="btn btn-error mb-1" onClick={deleteFetchLogs}>Eliminar logs seleccionados</button>
                    <button className="btn btn-secondary mb-1" onClick={() => filterAndFetch()}>Recargar</button>
                </div>
            </div>

            {!isLoading &&
                <div className="flex h-[90vh] w-full">
                    <LogsTable logs={logs} selectedRow={selectedRow} onSelect={(r) => router.push(`/main_navigation/logs/${r}`)}></LogsTable>

                </div>
            }

        </div>
    );
}
