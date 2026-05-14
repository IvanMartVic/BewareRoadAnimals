"use server"
// import { prisma } from "@/../lib/prisma" 
// import { compare } from "bcryptjs";
// import * as jose from "jose"
// import { cookies } from "next/headers";
// import {  myLogOut, mySignIn, credentials, getAuthUserFromToken, authResetToken} from "@/utils/authUtils"
import { myAuth } from "@/utils/auth";
import * as authUtils from "@/utils/authUtils"


export async function SignIn({password, email}:authUtils.credentials){
    return authUtils.mySignIn({password, email});
}
export async function LogOut(){
    return authUtils.myLogOut();
}
export async function auth(){
    return await myAuth();
}
export async function authDevice({deviceId}:authUtils.deviceCredentials){
    return authUtils.authDevice({deviceId});

}

export async function getAuthUser(){
    return await authUtils.getAuthUserFromToken();
}

export async function verifyAuthResetToken(token:string){
    const res = await authUtils.authResetToken(token);
    return res;
}


