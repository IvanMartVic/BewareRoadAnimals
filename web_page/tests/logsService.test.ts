import { describe, test, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../lib/prisma';
import { Log } from '../generated/prisma/client';



let client = await vi.hoisted(async () => {
    // Importamos los módulos dentro de la elevación para que no fallen
    const { default: createPrismaMock } = await import('prisma-mock/client');
    const { Prisma } = await import('../generated/prisma/client');
    const dmmf = await import('../generated/dmmf')
    return createPrismaMock(Prisma, { datamodel: dmmf });
});
// let client;

vi.mock('../lib/prisma', () => ({
    prisma: client,
}))

const mockAuthResponse = { success: true };
vi.mock('@/services/authenticationService', () => ({
    authLogFilters: vi.fn(async () => mockAuthResponse),
}));

import { getAllLogs, filterAndDeleteLog } from '@/services/logsService';



async function seedDatabase({ num, deviceId = 1 }: { num: number, deviceId?: number }) {
    for (let i = 0; i < num; i++) {
        const log = await prisma.log.create({
            data: {
                deviceId: deviceId,
                message: "creado desde seed",
                type: "SISTEMA",
                timestamp: new Date(2020, 4, 3, i),
            }
        });
    }
}
function logsInOrder({ logs }: { logs: Array<Log> | undefined }) {
    if (logs == undefined) {
        return false;
    }
    for (let i = 0; i < logs.length - 1; i++) {
        if (logs[i].timestamp < logs[i + 1].timestamp) {
            return false;
        }
    }
    return true;
}
describe('logs CRUD and filters', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        client.$clear();
    });
    test('getAllLogs gets the logs in timestamp order', async () => {
        mockAuthResponse.success = true;
        await seedDatabase({ num: 10 });
        const logs = await getAllLogs();
        expect(logsInOrder({ logs })).toBe(true);
    });
    test('filterAndDeleteLog apply filters and deletes correctly', async () => {
        mockAuthResponse.success = true;
        await seedDatabase({ num: 10, deviceId: 10 });
        await seedDatabase({ num: 10, deviceId: 5 });
        let logs = await filterAndDeleteLog({ filters: { deviceId: 10 } });
        expect(logs?.count).toBe(10);
        logs = await filterAndDeleteLog({ filters: { deviceId: 10 } });
        expect(logs?.count).toBe(0);
    });
});


