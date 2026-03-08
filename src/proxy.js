// import { cookies } from "next/headers";
import { NextResponse } from "next/server";
// import { jwtVerify } from "jose"
import { myAuth } from "@/utils/auth.ts"


const LOGIN_URL = "/";

export default async function proxy(request) {
    // const {pathname} = request.nextUrl;
    // if(pathname.startsWith(LOGIN_URL)){
    //     return NextResponse.next();
    // }
    const authorized = await myAuth();
    console.log(authorized);
    if(authorized.success){
        return NextResponse.next();
    }else{
        const login_url = new URL(LOGIN_URL, request.url);
        return NextResponse.redirect(login_url);
    }

}
export const config = {
    // matcher: '/main_navigation((?!api|_next/static|_next/image|favicon.ico).*)',
    matcher: '/main_navigation',


}
