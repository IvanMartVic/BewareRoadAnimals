import { create } from "zustand";
import { getAllDevicesWithUser, createDevice, InputDevice, deleteDevice, UpdateDeviceInput, updateDevice, getDeviceById } from "@/services/deviceService"


interface OutputDevice extends InputDevice {
    id: number,
}
type deviceStoreState = {
    devices: OutputDevice[],
    isLoading: boolean,
    error: string | null,
};
type deviceStoreActions = {
    addDevice: (newDevice: InputDevice) => void,

}
type DeviceStore = deviceStoreState & deviceStoreActions;



const useDeviceStore = create<DeviceStore>((set) => ({
    devices: [],
    isLoading: false,
    error: null,
    fetchDevices: async () => {
        set({ isLoading: true });
        try {
            const res = await getAllDevicesWithUser();
            set({ devices: res, isLoading: false });
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message, isLoading: false });
            }
        }
    },
    addDevice: async (newDevice: InputDevice) => {
        try {
            const addedDevice: OutputDevice = await createDevice(newDevice);
            set((state) => ({ devices: [...state.devices, addedDevice] }));
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message });
            }
        }
    },
    deleteDevice: async (id: number) => {
        try {
            const deletedDevice: OutputDevice = await deleteDevice(id);
            set((state) => ({
                devices: state.devices.filter((device) => device.id != id)
            }));
            return deletedDevice;
        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message });
            }
        }
    },
    updateDevice: async ({ id, data }: UpdateDeviceInput) => {
        try {
            const updatedDevice: OutputDevice = await updateDevice({ id, data });
            set((state) => ({
                devices: state.devices.map((device) => device.id == id ? updatedDevice : device),
            }));

        } catch (e) {
            if (e instanceof Error) {
                set({ error: e.message });
            }
        }
    },
    getDeviceById: async (id:number) => {
        try{
            // we could cache this response with the array devices I think
            const selectedDevice: OutputDevice|null = await getDeviceById(id);
            if(!selectedDevice){
                throw new Error(`device with id: ${id} not in db`);
            }
            return selectedDevice;

        }catch(e){
            if(e instanceof Error){
                set({error:e.message});
            }
        }

    }
}));

export default useDeviceStore;
