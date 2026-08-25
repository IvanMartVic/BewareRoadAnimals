import { NextResponse } from "next/server";
import { verifyDeviceJWT } from "@/services/authenticationService";
import { prisma } from "@/../lib/prisma";
export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get("authorization");
        const sessionToken = authHeader?.startsWith("Bearer") ? authHeader.substring(7) : null;
        if (!sessionToken) {
            return NextResponse.json({ error: "Missing or malformed authorization header" }, { status: 400 })
        }
        const data = await req.json();
        // const { device, success } = await authDevice({ deviceId: +data.id, deployToken: data.deployToken });
        const { success, deviceInfo } = await verifyDeviceJWT(sessionToken);
        if (!success || !deviceInfo?.id || deviceInfo == undefined || !data?.type) {
            return NextResponse.json({ error: "invalid json or empty body" }, { status: 401 });
        }
        await prisma.log.create({
            data: {
                deviceId: deviceInfo.id,
                type: data.type,
                message: data.message,
                image: data.image,
            }
        });
        console.log("deteccion recivida de dispositivo " + data.id)
        return NextResponse.json({ message: "detection received from device " + data.id }, { status: 200 });

    } catch (e) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

}
