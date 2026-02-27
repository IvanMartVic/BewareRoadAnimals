import { cookies } from "next/headers";
import { jwtVerify } from "jose";

export interface AuthTokenData {
    full_name: string,
    email: string,
    role: string,
    userId: number,
}

export type AuthResult =
    | { success: true; userData: AuthTokenData }
    | { success: false; userData?: never }



export async function myAuth():Promise<AuthResult> {
    const cookieStore = await cookies();
    const auth_token = cookieStore.get("auth-token");
    if (!auth_token) {
        return { success: false};
    }
    try {
        const secret = new TextEncoder().encode(process.env.SECRET_STRING);
        const res = await jwtVerify(auth_token.value, secret);
        return { success: true, userData: res.payload as unknown as AuthTokenData };
    } catch (e) {
        console.log("invalid auth-token" + auth_token);
        return { success: false };
    }
}

