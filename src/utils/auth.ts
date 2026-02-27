import { cookies } from "next/headers";
import { jwtVerify } from "jose";
export async function myAuth(){
    const cookieStore = await cookies();
    const auth_token = cookieStore.get("auth-token");
    if (!auth_token) {
        return {success:false};
    }
    try{
        const secret = new TextEncoder().encode(process.env.SECRET_STRING);
        const res = await jwtVerify(auth_token.value, secret);
        return {success:true, token_payload:res.payload};
    }catch(e){
        console.log("invalid auth-token" + auth_token);
        return {success:false};
    }
}

