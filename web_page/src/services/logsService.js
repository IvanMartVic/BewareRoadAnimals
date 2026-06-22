"use server"
import { prisma } from "@/../lib/prisma";

const PAGE_SIZE = 100;
export async function getAllLogs(filters = {}, page_number = 0) {
    const logs = await prisma.log.findMany({
        take: PAGE_SIZE,
        skip: page_number * PAGE_SIZE,
        where: {
            ...filters,
        },
        orderBy: {
            timestamp: 'desc',
        }
    });
    for (let log of logs) {
        console.log(log.timestamp);
    }
    return logs;
}
export async function getUserLogs({ filters = {}, userId, page_number = 0 }) {
    const logs = await prisma.log.findMany({
        take: PAGE_SIZE,
        skip: page_number * PAGE_SIZE,
        where: {
            deviceIn: {
                userId: userId,
            },
            ...filters,
        },
    });
    return logs;
}
export async function getLogsCount(filters = {}) {
    const logs = await prisma.log.count({
        where: {
            ...filters,
            // deviceId:13,
        }
    });
    return logs;
}


export async function createLog({ message, image }) {
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
export async function filterAndDeleteLog({ filters = {}, userId }) {
    let logs;
    if (userId) {
        logs = await prisma.log.deleteMany({
            where: {
                deviceIn: {
                    userId: userId,
                },
                ...filters,
            },
        });
    } else {
        logs = await prisma.log.deleteMany({
            where: {
                ...filters,
            },
        });

    }
    return logs;
}
export async function getMostRecentLog({ filters = {} }) {
    let log;
    const logFilters = { ...filters };
    if (filters.userId) {
        delete logFilters.userId;
        log = await prisma.log.findFirst({
            where: {
                deviceIn: {
                    userId: +filters.userId,
                },
                ...logFilters,
            },
            orderBy: {
                timestamp: 'desc',
            }
        });
    } else {
        log = await prisma.log.findFirst({
            where: {
                ...logFilters,
            },
            orderBy: {
                timestamp: 'desc',
            }
        });
    }
    return log;
}


