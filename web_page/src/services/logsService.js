"use server"
import { prisma } from "@/../lib/prisma";

export async function getAllLogs(filters={}) {
    const logs = await prisma.log.findMany({
        where:{
            ...filters,
        }
    });
    return logs;
}
export async function getLogsCount(filters={}) {
    const logs = await prisma.log.count({
        where:{
            ...filters,
        }
    });
    return logs;
}


export async function createLog({message, image}) {
    const new_log = await prisma.log.create({
        data: {
            message: message,
            image: image,
        }
    });
    return new_log;
}

export async function updateLog({ data: new_data, id }) {
    const updated = await prisma.log.update({
        where: {
            id: id,
        },
        data: { ...new_data },
    });
    return updated;
}

export async function getLogById(id) {
    const log = await prisma.log.findUnique({
        where: {
            id: id,
        },
    });
    return log;
}

export async function deleteLog(id) {
    const log = await prisma.log.delete({
        where: {
            id: id,
        },
    });
    return log;
}


