import { create } from "zustand";
import { getAllLogs, deleteLog, getLogsCount, getUserLogs, filterAndDeleteLog } from "@/services/logsService"


const useLogStore = create((set, get) => ({
    logs: [],
    logCount: 0,
    detectCount: 0,
    systemCount: 0,
    batteryWarningCount: 0,
    emergencyCount: 0,
    isLoading: false,
    error: null,
    eventSource: null,
    fetchLogsRT: async (filters = {}) => {
        try {
            set({ isLoading: true })
            const queryParams = new URLSearchParams(filters).toString();
            const url = queryParams ? `/api/logs?${queryParams}` : '/api/logs'
            if (get().eventSource) {
                get().eventSource.close();
            }
            get().fetchLogs(filters);

            const eventSource = new EventSource(url);
            eventSource.onopen = () => {
                console.log("SSE connection to logs established");
                set({ isLoading: false });
            };

            eventSource.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.log) {
                    // const parsedLog = data.log.map(l => ({
                    //     ...l,
                    //     timestamp: new Date(l.timestamp)
                    // }));
                    const parsedLog = { ...data.log, timestamp: new Date(data.log.timestamp) };
                    const currentMostRecent = get().logs[0];
                    if (!currentMostRecent || parsedLog.timestamp > currentMostRecent.timestamp) {
                        set({ logs: [parsedLog, ...get().logs], isLoading: false });

                    }

                    // const sortedLogs = parsedLogs.sort((a, b) => b.timestamp - a.timestamp);
                }
            };
            eventSource.onerror = (error) => {
                console.error('SSE error: ', error);
                eventSource.close();
                set({ error: "SSE connection failed or disconected", isLoading: false });
            }
            set({ eventSource })
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message, isLoading: false });
            }
        }
    },
    fetchLogs: async (filters = {}) => {
        set({ isLoading: true });
        try {
            let res;
            if ("userId" in filters) {
                const logFilters = { ...filters };
                delete logFilters.userId;
                res = await getUserLogs({ filters: logFilters, userId: filters.userId });
                if (res.length == 0) {
                    //posible error set here
                }

            } else {
                res = await getAllLogs({ ...filters });
            }
            const sortedLogs = res.sort((a, b) => b.timestamp - a.timestamp);
            set({ logs: sortedLogs, isLoading: false });
            return res;
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message, isLoading: false });
            }
        }
    },
    //posible mejora: añadir un contador de ultima request para evitar race conditions en este Store
    fetchLogTypeCount: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const [logCount, detectCount, systemCount, batteryWarningCount, emergencyCount] = await Promise.all([
                getLogsCount({ ...filters }),
                getLogsCount({ ...filters, type: "DETECCION" }),
                getLogsCount({ ...filters, type: "SISTEMA" }),
                getLogsCount({ ...filters, type: "BATERIA" }),
                getLogsCount({ ...filters, type: "ALERTA" }),
            ]);
            set({ logCount: logCount, detectCount: detectCount, systemCount: systemCount, batteryWarningCount: batteryWarningCount, emergencyCount: emergencyCount, isLoading: false });
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message, isLoading: false });
            }
            return null;
        }
    },
    fetchDeviceLogs: async (deviceId) => {
        set({ isLoading: true });
        try {
            const res = await getAllLogs({ deviceId: deviceId });
            set({ logs: res, isLoading: false });
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message, isLoading: false });
            }
        }
    },
    deleteLog: async (id) => {
        try {
            const deletedLog = await deleteLog(id);
            set((state) => ({
                logs: state.logs.filter((log) => log.id != id)
            }));
            return deletedLog;
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message });
            }
        }
    },
    deleteAllLogs: async (filters = {}) => {
        set({ isLoading: true });
        try {
            let res;
            if (filters.userId) {
                const logFilters = { ...filters };
                delete logFilters.userId;
                res = await filterAndDeleteLog({ filters: logFilters, userId: filters.userId });

            } else {
                res = await filterAndDeleteLog({ ...filters });
            }
            set({ logs: [], isLoading: false });
            return res;
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message, isLoading: false });
            }
        }
    },
}));

export default useLogStore;
