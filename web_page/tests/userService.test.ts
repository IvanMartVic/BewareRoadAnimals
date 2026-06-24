import { describe, test, expect, vi, beforeEach } from 'vitest';

// vi.mock('next/headers', () => ({
//     cookies: () => ({
//         get: () => ({ value: 'token_valido' }),
//     }),
// }));

const mockAuthResponse = { success: true, user: {} };
vi.mock('@/services/authenticationService', () => ({
    authAdmin: vi.fn(async () => mockAuthResponse),
    verifyAuthResetToken: vi.fn(async () => mockAuthResponse)
}));

const mockFindMany = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
vi.mock('../lib/prisma', () => ({
    prisma: {
        user: {
            findMany: async (args: any) => mockFindMany(args),
            create: async (args: any) => mockCreate(args),
            update: async (args: any) => mockUpdate(args),
        },
    },
}));

import { getAllUsers, createUser, changeUserPassword } from '@/services/userService';


describe('tests users CRUD', () => {

    beforeEach(() => {
        vi.clearAllMocks();
        mockFindMany.mockReset(); // Limpia el mock de prisma entre tests
        mockCreate.mockReset();
        mockUpdate.mockReset();
    });

    test('getAllUsers admin can get the users', async () => {
        mockAuthResponse.success = true;
        const mockUsers = [{ id: 1, Full_name: 'Ivan', role: 'ADMIN' },
        { id: 2, Full_name: 'Ivan2', role: 'USER' }];

        mockFindMany.mockResolvedValue(mockUsers);
        const resultado = await getAllUsers();
        expect(resultado).toEqual(mockUsers);
    });

    test('getAllUsers not admin can not get the users', async () => {
        mockAuthResponse.success = false;
        const resultado = await getAllUsers();
        expect(resultado).toBeUndefined();
        expect(mockFindMany).not.toHaveBeenCalled();
    });
    test('getAllUsers is passing filters to prisma', async () => {
        mockAuthResponse.success = true;
        const mockUsers = [{ id: 1, Full_name: 'Ivan', role: 'ADMIN' },
        { id: 2, Full_name: 'Ivan2', role: 'USER' }];
        const testFilters = { role: "ADMIN" }
        mockFindMany.mockResolvedValue(mockUsers);
        const resultado = await getAllUsers(testFilters);
        expect(resultado).toEqual(mockUsers);
        expect(mockFindMany).toHaveBeenCalledWith({
            where: {
                role: "ADMIN"
            }
        })
    });
    test('createUser is passing the correct data to prisma', async () => {
        mockAuthResponse.success = true;
        const newUser = { full_name: "Alice example", email: "hey@gmail", password: "1234", role: "ADMIN" }
        await createUser(newUser);
        const { password, ...rest } = newUser;
        expect(mockCreate).toHaveBeenCalledWith({
            data: expect.objectContaining({
                ...rest,
            }),
        })
        const callArgs = mockCreate.mock.calls[0][0].data;
        expect(callArgs.password_hash).not.toBe('1234');
    });
    test('changeUserPassword is passing the correct data to prisma', async () => {
        mockAuthResponse.success = true;
        mockAuthResponse.user = { "id": 2 };
        mockUpdate.mockResolvedValue(true);
        await changeUserPassword({ new_password: '1234', resetToken: 'token' });
        expect(mockUpdate).toHaveBeenCalledWith(
            {
                where: { id: 2 },
                data: { password_hash: expect.any(String), resetToken: null, tokenExpiry: null }
            });
        const callArgs = mockUpdate.mock.calls[0][0].data;
        expect(callArgs.password_hash).not.toBe('1234');
    })
});

