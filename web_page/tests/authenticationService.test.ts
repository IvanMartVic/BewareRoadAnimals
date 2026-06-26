import { describe, test, expect, vi, beforeEach } from 'vitest';
import { prisma } from '../lib/prisma';
import bcrypt from "bcryptjs";

vi.mock('../lib/prisma', () => ({
    prisma: client,
}));

const mockSet = vi.fn();
vi.mock('next/headers', () => ({
    cookies: async () => ({
        get: vi.fn(),
        set: mockSet,
        delete: vi.fn(),
    })
}));



let client = await vi.hoisted(async () => {
    // Importamos los módulos dentro de la elevación para que no fallen
    const { default: createPrismaMock } = await import('prisma-mock/client');
    const { Prisma } = await import('../generated/prisma/client');
    const dmmf = await import('../generated/dmmf')
    return createPrismaMock(Prisma, { datamodel: dmmf });
});

beforeEach(() => {
    vi.clearAllMocks();
    client.$clear();
});

const mockAuthResponse = { success: true };
// vi.mock('@/services/authenticationService', () => ({
//     authLogFilters: vi.fn(async () => mockAuthResponse),
// }));

import { authDevice, SignIn, verifyAuthResetToken } from '@/services/authenticationService';

describe('Device authentication', () => {
    test('A registered and active device pass the authentication', async () => {
        prisma.device.create({
            data: {
                id: 1,
                coordLatitude: 10,
                coordLength: 2,
                userId: 1,
                status: "ACTIVE",
            }
        });
        const { success } = await authDevice({ deviceId: 1 });
        expect(success).toBe(true);
    });
    test('An unregistered device and an INACTIVE device do not pass the authentication', async () => {
        let res = await authDevice({ deviceId: 1 });
        expect(res.success).toBe(false);
        prisma.device.create({
            data: {
                id: 1,
                coordLatitude: 10,
                coordLength: 2,
                userId: 1,
                status: "INACTIVE",
            }
        });
        res = await authDevice({ deviceId: 1 });
        expect(res.success).toBe(false);
    });
});
describe('User access', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        client.$clear();
        process.env.SECRET_STRING = 'una_clave_de_test_lo_suficientemente_larga_123456';
    });
    test('A registered user can SignIn', async () => {
        const password = "1234";
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const email = "hola@mundo.com";
        await prisma.user.create({
            data: {
                id: 1,
                full_name: "bobo martin",
                email: email,
                password_hash: hash,
            },
        });
        const { success } = await SignIn({ email: email, password: password });
        expect(success).toBe(true);
        expect(mockSet).toHaveBeenCalledWith("auth-token", expect.any(String));
    });
    test('A not registered user fails SignIn', async () => {
        const password = "1234";
        const email = "hola@mundo.com";
        const { success } = await SignIn({ email: email, password: password });
        expect(success).toBe(false);
    });
    test('wrong password fails SignIn', async () => {
        const password = "1234";
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const email = "hola@mundo.com";
        await prisma.user.create({
            data: {
                id: 1,
                full_name: "bobo martin",
                email: email,
                password_hash: hash,
            },
        });
        const { success } = await SignIn({ email: email, password: "12345" });
        expect(success).toBe(false);
    });
    test('Reset token access', async () => {
        const password = "1234";
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const token = "token2";
        const email = "hola@mundo.com";
        await prisma.user.create({
            data: {
                id: 1,
                full_name: "bobo martin",
                email: email,
                password_hash: hash,
                resetToken: token,
                tokenExpiry: new Date(9999, 0),
            },
        });
        const { success } = await verifyAuthResetToken(token);
        expect(success).toBe(true);
    });
    test('Reset token expiry', async () => {
        const password = "1234";
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
        const token = "token2";
        const email = "hola@mundo.com";
        await prisma.user.create({
            data: {
                id: 1,
                full_name: "bobo martin",
                email: email,
                password_hash: hash,
                resetToken: token,
                tokenExpiry: new Date(2015, 0),
            },
        });
        const { success } = await verifyAuthResetToken(token);
        expect(success).toBe(false);
    })
})
