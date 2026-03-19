"use server"
import { prisma } from "@/../lib/prisma";

export interface InputDevice {
    userId: number,
    coordLatitude: number
    coordLength: number
}
interface UpdateDeviceData {
    coordLatitude: number
    coordLength: number
}
export interface UpdateDeviceInput {
    id: number,
    data: UpdateDeviceData,
}

export async function getAllDevices() {
    const devices = await prisma.device.findMany();
    return devices;
}

export async function createDevice({ userId, coordLatitude, coordLength}: InputDevice) {
    const new_device = await prisma.device.create({
        data: {
            userId: userId,
            coordLatitude: coordLatitude,
            coordLength: coordLength,
        }
    });
    return new_device;
}

export async function updateDevice({ data: new_data, id }: UpdateDeviceInput) {
    const updated = await prisma.device.update({
        where: {
            id: id,
        },
        data: new_data,
    });
    return updated;
}

export async function getDeviceById(id: number) {
    const device = await prisma.device.findUnique({
        where: {
            id: id,
        },
    });
    return device;
}

export async function deleteDevice(id: number) {
    const device = await prisma.device.delete({
        where: {
            id: id,
        },
    });
    return device;
}


