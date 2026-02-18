import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose"
import { myAuth } from "./utils/authUtils";


const LOGIN_URL = "/login";

export default async function proxy(request) {
    const {pathname} = request.nextUrl;
    if(pathname.startsWith(LOGIN_URL)){
        return NextResponse.next();
    }
    const authorized = await myAuth();
    console.log(authorized);
    if(authorized.success){
        return NextResponse.next();
    }else{
        const login_url = new URL(LOGIN_URL, request.url);
        return NextResponse.redirect(login_url);
    }
    // const cookieStore = await cookies();
    // const auth_token = cookieStore.get("auth-token");
    // if (!auth_token) {
    //     const login_url = new URL(LOGIN_URL, request.url);
    //     return NextResponse.redirect(login_url);
    // }
    // try{
    //     const secret = new TextEncoder().encode(process.env.SECRET_STRING);
    //     await jwtVerify(auth_token.value, secret);
    //     return NextResponse.next();
    // }catch(e){
    //     console.log(e.name);
    //     console.log(e.message);
    //     console.log(auth_token);
    //     const login_url = new URL(LOGIN_URL, request.url);
    //     return NextResponse.redirect(login_url);
    // }


}
export const config = {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',


}
