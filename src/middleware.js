import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose"


const LOGIN_URL = "/login";

export default async function middleware() {
    const cookieStore = await cookies();
    const auth_token = cookieStore.get("auth-token");
    if (!auth_token) {
        const login_url = new URL(LOGIN_URL, request.url);
        return NextResponse.redirect(login_url);
    }
    try{
        const secret = new TextEncoder.encode(process.env.SECRET_STRING);
        await jwtVerify(auth_token, secret);
        return NextResponse.next();
    }catch(e){
        console.log(e.name);
        const login_url = new URL(LOGIN_URL, request.url);
        return NextResponse.redirect(login_url);
    }


}
export const config = {
    matcher: '/',

}
