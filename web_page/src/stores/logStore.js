import { create } from "zustand";
import { getAllLogs, deleteLog, getLogsCount } from "@/services/logsService"


const useLogStore = create((set, get) => ({
    logs: [],
    logCount: 0,
    detectCount: 0,
    systemCount: 0,
    batteryWarningCount: 0,
    emergencyCount: 0,
    isLoading: false,
    error: null,
    fetchLogs: async () => {
        set({ isLoading: true });
        try {
            const res = await getAllLogs();
            set({ logs: res, isLoading: false });
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message, isLoading: false });
            }
        }
    },
    fetchLogTypeCount: async () => {
        set({ isLoading: true });
        try {
            const logCount = await getLogsCount();
            const detectCount = await getLogsCount({ type: "DETECCION" });
            const systemCount = await getLogsCount({ type: "SISTEMA" });
            const batteryWarningCount = await getLogsCount({ type: "BATERIA" });
            const emergencyCount = await getLogsCount({ type: "ALERTA" });
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
                logs: state.log.filter((log) => log.id != id)
            }));
            return deletedLog;
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message });
            }
        }
    },
    deleteAllLogs: async () => {
        set({ logs: [] });
    },
}));

export default useLogStore;
