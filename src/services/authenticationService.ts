"use server"
import { prisma } from "@/../lib/prisma" 
import { compare } from "bcryptjs";
import * as jose from "jose"
import { cookies } from "next/headers";

interface credentials{
    password:string;
    email:string;
}
export async function SignIn({password, email}:credentials){
    const user = await prisma.user.findUnique({
        where:{
            email:email,
        }
    });
    if(!user){
        return {
            success:false,
            message:"No account found",
        }
    }
    console.log(`signing user in ${email}`);
    const isUser = await compare(password, user.password_hash);
    if(isUser){
        const secret = new TextEncoder().encode(process.env.SECRET_STRING);
        const alg = 'HS256'
        const jwt = await new jose.SignJWT({email:email, full_name:user.full_name, role:user.role})
        .setProtectedHeader({alg})
        .setExpirationTime('1h')
        .sign(secret);
        const cookieStore = await cookies();
        cookieStore.set("auth-token", jwt);
        console.log(jwt);
    }
    return {success:isUser};
}
