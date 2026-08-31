import { create } from "zustand";
import { getAllDevicesWithUser, createDevice, InputDevice, deleteDevice, UpdateDeviceInput, updateDevice, getDeviceById, getDevicesCount } from "@/services/deviceService"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/client";


interface OutputDevice {
    id: number,
    userId: number,
    coordLatitude: number
    coordLength: number
}
type deviceStoreState = {
    devices: OutputDevice[],
    count: number,
    isLoading: boolean,
    error: { message: string, code: number } | null,
};
type deviceStoreActions = {
    addDevice: (newDevice: InputDevice) => void,

}
type DeviceStore = deviceStoreState & deviceStoreActions;

const AUTH_FAIL_MESSAGE = "Fallo de autenticación";
const UNEXPECTED_FAIL_MESSAGE = "Fallo inesperado";
const LOGS_FAIL_MESSAGE = "El dispositivo tiene logs asociados";



const useDeviceStore = create<DeviceStore>((set) => ({
    devices: [],
    count: 0,
    isLoading: false,
    error: null,
    fetchDevices: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const res = await getAllDevicesWithUser(filters);
            set({ devices: res, isLoading: false });
        } catch (e) {
            if (e instanceof Error) {
                set({ error: { message: e.message, code: 2 }, isLoading: false });
            }
        }
    },
    fetchDevicesCount: async (filters = {}) => {
        set({ isLoading: true });
        try {
            const res = await getDevicesCount({ ...filters });
            set({ count: res, isLoading: false });
        } catch (e) {
            if (e instanceof Error) {
                set({ error: { message: e.message, code: 2 }, isLoading: false });
            }
        }
    },
    addDevice: async (newDevice: InputDevice) => {
        try {
            const addedDevice: OutputDevice = await createDevice(newDevice);
            set((state) => ({ devices: [...state.devices, addedDevice] }));
        } catch (e) {
            if (e instanceof Error) {
                set({ error: { message: e.message, code: 2 } });
            }
        }
    },
    deleteDevice: async (id: number, forceLogsDeletion = false) => {
        try {
            const { success, error }: { success: boolean, error: number | null } = await deleteDevice({ id: id, deleteLogs: forceLogsDeletion });
            if (error == 0) {
                set({ error: { code: 0, message: AUTH_FAIL_MESSAGE } });
                return { success: success, errorCode: 0 };
            } else if (error == 1) {
                set({ error: { code: 1, message: AUTH_FAIL_MESSAGE } });
                return { success: success, errorCode: 1 };
            }
            set((state) => ({
                devices: state?.devices?.filter((device) => device.id != id),
                error: null
            }));
            return { success: success };
        } catch (e) {
            if (e instanceof Error) {
                set({ error: { code: 2, message: AUTH_FAIL_MESSAGE } });
                return { success: false, errorCode: 2 };
            }
        }
    },
    updateDevice: async ({ id, data }: UpdateDeviceInput) => {
        try {
            const updatedDevice: OutputDevice | undefined = await updateDevice({ id, data });
            if (!updatedDevice) {
                return;
            }
            set((state) => ({
                devices: state.devices.map((device) => device.id == id ? updatedDevice : device),
            }));

        } catch (e) {
            if (e instanceof Error) {
                set({ error: { message: e.message, code: 2 } });

            }
        }
    },
    getDeviceById: async (id: number) => {
        try {
            // we could cache this response with the array devices I think
            const selectedDevice: OutputDevice | undefined | null = await getDeviceById(id);
            if (!selectedDevice) {
                throw new Error(`device with id: ${id} not in db`);
            }
            return selectedDevice;

        } catch (e) {
            if (e instanceof Error) {
                set({ error: { message: e.message, code: 2 } });
            }
        }

    }
}));

export default useDeviceStore;
