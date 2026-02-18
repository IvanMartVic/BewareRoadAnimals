"use server"
import { prisma } from "@/../lib/prisma";

export async function getAllDevices(){
    const devices = await prisma.device.findMany();
    return devices;
}

export async function createDevice(userId:number, coordinates:string){
    const new_device = await prisma.device.create({
        data: {
            userId:userId,
            coordinates:coordinates,
        } 
    });
    return new_device;
} 

