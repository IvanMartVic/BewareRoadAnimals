"use server"
import { myAuth } from "@/utils/auth";
import { prisma } from "@/../lib/prisma";
import * as authUtils from "@/utils/authUtils"
import { DeviceFilters } from "@/services/deviceService";
import { LogFilters } from "@/services/logsService";


export async function SignIn({ password, email }: authUtils.credentials) {
    return authUtils.mySignIn({ password, email });
}
export async function LogOut() {
    return authUtils.myLogOut();
}
export async function auth() {
    return await myAuth();
}
export async function authDevice({ deviceId }: authUtils.deviceCredentials) {
    return authUtils.authDevice({ deviceId });
}

export async function authAdmin() {
    const auth_res = await auth();
    if (!auth_res.success) {
        return { success: false };
    }
    return { success: auth_res.userData.role == "ADMIN", userData: auth_res.userData };
}

export async function authDeviceFilters(filter: DeviceFilters) {
    const auth_res = await auth();
    if (!auth_res.success) {
        return { success: false };
    }
    if (auth_res.userData.role == "ADMIN") {
        return { success: true, userData: auth_res.userData };
    }
    const user_devices = await prisma.device.findMany({
        where: {
            userId: auth_res.userData.userId,
        }
    });
    if (filter.id) {
        for (const device of user_devices) {
            if (device.id == filter.id) {
                return { success: true, userData: auth_res.userData };
            }
        }
    }
    if (filter.userId) {
        return { success: filter.userId === auth_res.userData.userId, userData: auth_res.userData };
    }
    console.error(`error usuario ${auth_res.userData.userId} no está autorizado para usar el filtro ${JSON.stringify(filter)}`)
    return { success: false };
}

export async function authLogFilters(filter: LogFilters) {
    const anHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    if (filter.timestampGte) {
        const parsedDate = new Date(filter.timestampGte);
        if (isNaN(parsedDate.getTime())) {
            return { success: false, error: "Invalid date format provided." };
        }
        if (parsedDate < anHourAgo) {
            return { success: true };
        }
    }
    const auth_res = await auth();
    if (!auth_res.success) {
        return { success: false };
    }
    if (auth_res.userData.role == "ADMIN") {
        return { success: true, userData: auth_res.userData };
    }
    const user_devices = await prisma.device.findMany({
        where: {
            userId: auth_res.userData.userId,
        }
    });
    if (filter.deviceId) {
        if (user_devices.some(d => d.id === filter.deviceId)) {
            return { success: true, userData: auth_res.userData };
        }
        // for (const device of user_devices) {
        //     if (device.id == filter.deviceId) {
        //         return { success: true, userData: auth_res.userData };
        //     }
        // }
    }
    if (filter.userId) {
        return { success: filter.userId === auth_res.userData.userId, userData: auth_res.userData };
    }
    const user_logs = await prisma.log.findMany({
        where: {
            deviceIn: {
                userId: auth_res.userData.userId,
            },
        }
    });

    if (filter.id) {
        if (user_logs.some(l => l.id === filter.id)) {
            return { success: true, userData: auth_res.userData };
        }
    }
    console.error(`error usuario ${auth_res.userData.userId} no está autorizado para usar el filtro ${JSON.stringify(filter)}`)
    return { success: false };

}

export async function getAuthUser() {
    return await authUtils.getAuthUserFromToken();
}

export async function verifyAuthResetToken(token: string) {
    const res = await authUtils.authResetToken(token);
    return res;
}


