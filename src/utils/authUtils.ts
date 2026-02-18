import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { prisma } from "../../lib/prisma";
import { compare } from "bcryptjs";
export async function myAuth(){
    const cookieStore = await cookies();
    const auth_token = cookieStore.get("auth-token");
    if (!auth_token) {
        return {success:false};
    }
    try{
        const secret = new TextEncoder().encode(process.env.SECRET_STRING);
        const res = await jwtVerify(auth_token.value, secret);
        return {success:true, token:res};
    }catch(e){
        console.log(e?.name);
        console.log(e?.message);
        console.log(auth_token);
        return {success:false};
    }
}
export async function myLogOut(){
    const cookieStore = await cookies();
    cookieStore.delete("auth-token");
}
export interface credentials{
    password:string;
    email:string;
}

export async function mySignIn({password, email}:credentials){
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
        const jwt = await new SignJWT({email:email, full_name:user.full_name, role:user.role})
        .setProtectedHeader({alg})
        .setExpirationTime('1h')
        .sign(secret);
        const cookieStore = await cookies();
        cookieStore.set("auth-token", jwt);
        console.log(jwt);
    }
    return {success:isUser};
}
