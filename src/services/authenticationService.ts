"use server"
// import { prisma } from "@/../lib/prisma" 
// import { compare } from "bcryptjs";
// import * as jose from "jose"
// import { cookies } from "next/headers";
import {  myLogOut, mySignIn, credentials, getAuthUserFromToken} from "@/utils/authUtils"
import { myAuth } from "@/utils/auth";


export async function SignIn({password, email}:credentials){
    return mySignIn({password, email});
}
export async function LogOut(){
    return myLogOut();
}
export async function auth(){
    return await myAuth();
}

export async function getAuthUser(){
    return await getAuthUserFromToken();
}
