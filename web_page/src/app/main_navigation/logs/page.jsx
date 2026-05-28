"use client"
import LogsTable from "@/components/LogsTable"
import useLogStore from "@/stores/logStore";
import useAuthStore from "@/stores/authStore";
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
    const { logs, fetchLogsRT, isLoading, deleteAllLogs } = useLogStore(
        useShallow((state) => ({
            logs: state.logs,
            fetchLogsRT: state.fetchLogsRT,
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
        const queryFilter = {
            deviceId: filter.deviceId,
            type: filter.type,
            userId: filter.userId,
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

    }, [fetchLogsRT, filter.deviceId, filter.type, filter.userId]);
    const deleteFetchLogs = async () => {
        const choice = confirm(`eliminar ${logs.length} logs`);
        if (choice) {
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
            await deleteAllLogs(queryFilter);
            filterAndFetch();
        }
    }

    useEffect(() => {
        filterAndFetch();
    }, [filterAndFetch]);
    useEffect(() => {
        fetchAuthUser();
    }, [fetchAuthUser]);


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
                <div className="flex w-4/12 gap-4 items-end justify-end">
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
