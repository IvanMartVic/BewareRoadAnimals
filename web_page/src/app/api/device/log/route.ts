import { NextResponse } from "next/server";
import { authDevice } from "@/services/authenticationService";
import { prisma } from "@/../lib/prisma";
export async function POST(req: Request) {
    try {
        const data = await req.json();
        if (data.id) {
            const { device, success } = await authDevice({ deviceId: +data.id });
            if (!success) {
                return NextResponse.json({ error: "invalid json or empty body" }, { status: 400 });
            }
            await prisma.log.create({
                data:{
                    deviceId:+data.id,
                    type: data.type,
                    message: data.message,
                    image: data.image,
                }
            });
            console.log("deteccion recivida " + data.id + data.image)
            return NextResponse.json({message:"detection received from device " + data.id}, {status:200});
        }else{
            throw new Error("no data.id")
        }

    } catch (e) {
        return NextResponse.json({ error: "invalid json or empty body" }, { status: 400 });
    }

}
