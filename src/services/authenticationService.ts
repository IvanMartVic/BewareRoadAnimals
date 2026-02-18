"use server"
// import { prisma } from "@/../lib/prisma" 
// import { compare } from "bcryptjs";
// import * as jose from "jose"
// import { cookies } from "next/headers";
import { myAuth, myLogOut, mySignIn, credentials} from "@/utils/authUtils"


export async function SignIn({password, email}:credentials){
    return mySignIn({password, email});
}
export async function LogOut(){
    return myLogOut();
}
export async function auth(){
    return await myAuth();
}
