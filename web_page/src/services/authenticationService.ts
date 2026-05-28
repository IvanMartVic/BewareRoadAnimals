"use server"
import { myAuth } from "@/utils/auth";
import * as authUtils from "@/utils/authUtils"


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

export async function getAuthUser() {
    return await authUtils.getAuthUserFromToken();
}

export async function verifyAuthResetToken(token: string) {
    const res = await authUtils.authResetToken(token);
    return res;
}


