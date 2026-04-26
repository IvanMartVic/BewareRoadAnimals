import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "../../lib/prisma";
import { compare } from "bcryptjs";
import { myAuth } from "./auth";
import { OutputUser } from "@/services/userService";
export async function myLogOut() {
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
}
export interface credentials {
    password: string;
    email: string;
}

export async function mySignIn({ password, email }: credentials) {
    const user = await prisma.user.findUnique({
        where: {
            email: email,
        }
    });
    if (!user) {
        return {
            success: false,
            message: "No account found",
        }
    }
    console.log(`signing user in ${email}`);
    const isUser = await compare(password, user.password_hash);
    if (isUser) {
        const secret = new TextEncoder().encode(process.env.SECRET_STRING);
        const alg = 'HS256'
        const jwt = await new SignJWT({ email: email, full_name: user.full_name, role: user.role, userId: user.id })
            .setProtectedHeader({ alg })
            .setExpirationTime('1h')
            .sign(secret);
        const cookieStore = await cookies();
        cookieStore.set("auth-token", jwt);
        console.log(jwt);
    }
    return { success: isUser };
}


export async function getAuthUserFromToken() {
    const auth_res = await myAuth();
    if (false == auth_res.success)
        throw new Error("getAuthUserFromToken called with an unvalid token");
    console.log(JSON.stringify(auth_res.userData));
    const { full_name, email, role, userId } = auth_res.userData;
    return { full_name, email, role, userId };
}

export async function authResetToken(token: string): Promise<{ success: boolean, user: OutputUser | null}> {
    const user = await prisma.user.findUnique({
        where: {
            resetToken: token,
            tokenExpiry: { gte: new Date() }
        }
    });
    if (user) {
        return ({ success: true, user:user });
    }
    return ({ success: false, user:user});
}

