"use server"
import { prisma } from "@/../lib/prisma";
import { authLogFilters } from "@/services/authenticationService";

export interface LogFilters {
    id?: number;
    userId?: number;
    timestamp?: Date;
    type?: string;
    deviceId?: number;
}

const PAGE_SIZE = 100;
export async function getAllLogs(filters: LogFilters = {}, page_number: number = 0) {
    const { success } = await authLogFilters(filters);
    if (!success) {
        return;
    }
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
export async function getUserLogs({ filters = {}, userId, page_number = 0 }:
    { filters: LogFilters, userId: number, page_number: number }) {
    const { success } = await authLogFilters(filters);
    if (!success) {
        return;
    }
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
    const { success } = await authLogFilters(filters);
    if (!success) {
        return;
    }
    const logs = await prisma.log.count({
        where: {
            ...filters,
            // deviceId:13,
        }
    });
    return logs;
}

export async function getLogById(id: number) {
    const { success } = await authLogFilters({ id: id });
    if (!success) {
        return;
    }
    const log = await prisma.log.findUnique({
        where: {
            id: id,
        },
    });
    return log;
}

export async function deleteLog(id: number) {
    const { success } = await authLogFilters({ id: id });
    if (!success) {
        return;
    }
    const log = await prisma.log.delete({
        where: {
            id: id,
        },
    });
    return log;
}
export async function filterAndDeleteLog({ filters = {} }: { filters: LogFilters }) {
    const { success } = await authLogFilters(filters);
    if (!success) {
        return;
    }
    let logs;
    if (filters.userId) {
        logs = await prisma.log.deleteMany({
            where: {
                deviceIn: {
                    userId: filters.userId,
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
export async function getMostRecentLog({ filters = {} }: { filters: LogFilters }) {
    const { success } = await authLogFilters(filters);
    if (!success) {
        return;
    }
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


