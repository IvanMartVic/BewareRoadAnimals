import { create } from "zustand";
import {getAllLogs, deleteLog} from "@/services/logsService"


const useLogStore = create((set, get) => ({
    logs: [],
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
    fetchDeviceLogs: async (deviceId) => {
        set({ isLoading: true });
        try {
            const res = await getAllLogs({deviceId:deviceId});
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
        set({logs:[]});
    },
}));

export default useLogStore;
