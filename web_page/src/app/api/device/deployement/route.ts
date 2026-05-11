import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const device = await prisma.device.findUnique({
            where:
                { id: +body.id }
        });
        if(device){
            await prisma.log.create({
                data:{
                    type:"SISTEMA",
                    deviceId:+body.id,
                    message:"dispositivo desplegado",
                }
            });
            await prisma.device.update({
                where:{
                    id: +body.id,
                },
                data:{
                    status:"ACTIVE",
                }
            });
        }
        return NextResponse.json({
            message: `device ${body.id} received`
        }, { status: 200 });

    } catch (error) {
        return NextResponse.json({
            error: `invalid JSON or empty body`
        }, { status: 400 });
    }
}
