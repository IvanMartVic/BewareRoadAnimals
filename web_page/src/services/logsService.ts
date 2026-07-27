"use server"
import { prisma } from "@/../lib/prisma";
import { authLogFilters } from "@/services/authenticationService";

export interface LogFilters {
    id?: number;
    userId?: number;
    timestamp?: Date;
    type?: string;
    deviceId?: number;
    timestampGte?: string;
}

const PAGE_SIZE = 100;
export async function getLogs({
    filters = {},
    page_number = 0,
}: {
    filters: LogFilters;
    page_number?: number;
}) {
    const { success } = await authLogFilters(filters);
    if (!success) return;

    const { userId, timestampGte, ...otherFilters } = filters;

    // console.log("Filtro recibido:", filters);
    // console.log("En Date():", new Date(filters.timestampGte).toISOString());
    // console.log("En hora local:", new Date(filters.timestampGte).toString());

    // const where_clause = {
    //     ...otherFilters,
    //     ...(userId && {
    //         deviceIn: { userId: +userId }
    //     }),
    //     ...(timestampGte && {
    //         timestamp: { gte: new Date(timestampGte) }
    //     }),
    // }
    // console.log(JSON.stringify(where_clause))


    const logs = await prisma.log.findMany({
        take: PAGE_SIZE,
        skip: page_number * PAGE_SIZE,
        where: {
            ...otherFilters,
            ...(userId && {
                deviceIn: { userId: +userId },
            }),
            ...(timestampGte && {
                timestamp: { gte: new Date(timestampGte) },
            }),
        },
        include: {
            deviceIn: {
                select: {
                    coordLatitude: true,
                    coordLength: true,
                },
            },
        },
    });
    // console.log(JSON.stringify(logs))
    return logs
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
    if (!success) return;

    const { userId, timestampGte, ...otherFilters } = filters;
    // console.log("Filtro recibido:", filters.timestampGte);
    // console.log("En Date():", new Date(filters.timestampGte).toISOString());
    // console.log("En hora local:", new Date(filters.timestampGte).toString());
    // const where_clause = {
    //     ...otherFilters,
    //     ...(userId && {
    //         deviceIn: { userId: +userId }
    //     }),
    //     ...(timestampGte && {
    //         timestamp: { gte: new Date(timestampGte) }
    //     }),
    // }
    // console.log(JSON.stringify(where_clause))


    const log = await prisma.log.findFirst({
        where: {
            ...otherFilters,
            ...(userId && {
                deviceIn: { userId: +userId }
            }),
            ...(timestampGte && {
                timestamp: { gte: new Date(timestampGte) }
            }),
        },
        include: {
            deviceIn: {
                select: {
                    coordLatitude: true,
                    coordLength: true,
                }
            }
        },
        orderBy: {
            timestamp: 'desc',
        }
    });
    // console.error(JSON.stringify(log))
    return log
}


