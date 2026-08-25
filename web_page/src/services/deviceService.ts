"use server"
import { prisma } from "@/../lib/prisma";
import { authDeviceFilters } from "@/services/authenticationService";

export interface InputDevice {
    userId: number,
    coordLatitude: number
    coordLength: number
    deployToken: String
}
interface UpdateDeviceData {
    coordLatitude: number
    coordLength: number
}
export interface UpdateDeviceInput {
    id: number,
    data: UpdateDeviceData,
}
export interface DeviceFilters {
    userId?: number,
    status?: string,
    id?: number,
}

export async function getAllDevicesWithUser(filters = {}) {
    //only admin is authorized to use this function
    const { success } = await authDeviceFilters(filters);
    if (!success) {
        return;
    }
    const devices = await prisma.device.findMany({
        include: {
            deployedBy: {
                select: {
                    full_name: true,
                }
            }
        },
        where: {
            ...filters,
        }
    });
    return devices;
}
export async function getDevicesCount(filters = {}) {
    const { success } = await authDeviceFilters(filters);
    if (!success) {
        return;
    }
    const devices = await prisma.device.count({
        where: {
            ...filters,
        }
    });
    return devices;
}

export async function createDevice({ userId, coordLatitude, coordLength, deployToken }: InputDevice) {
    const new_device = await prisma.device.create({
        data: {
            userId: userId,
            coordLatitude: coordLatitude,
            coordLength: coordLength,
            deployToken: deployToken,
        }
    });
    return new_device;
}

export async function updateDevice({ data: new_data, id }: UpdateDeviceInput) {
    const { success } = await authDeviceFilters({ id: id });
    if (!success) {
        return;
    }
    const updated = await prisma.device.update({
        where: {
            id: id,
        },
        data: { ...new_data },
    });
    return updated;
}

export async function getDeviceById(id: number) {
    const { success } = await authDeviceFilters({ id: id });
    if (!success) {
        return;
    }
    const device = await prisma.device.findUnique({
        where: {
            id: id,
        },
    });
    return device;
}

export async function deleteDevice(id: number) {
    const { success } = await authDeviceFilters({ id: id });
    if (!success) {
        return;
    }
    const device = await prisma.device.delete({
        where: {
            id: id,
        },
    });
    return device;
}


