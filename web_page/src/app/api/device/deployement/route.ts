import { NextResponse } from "next/server";
import { prisma } from "@/../lib/prisma";
import { authDevice } from "@/services/authenticationService";
export async function POST(request: Request) {
    try {
        const deployTokenHeader = request.headers.get("deployToken");
        const deployToken = deployTokenHeader
        if (!deployToken) {
            return NextResponse.json({ error: "Missing or malformed deployToken header" }, { status: 401 })
        }
        const body = await request.json();
        if (!body?.id) {
            console.log("malformed request body" + deployToken)
            return NextResponse.json({
                error: `malformed request body`
            }, { status: 400 });
        }
        const { success, device, jwt } = await authDevice({ deviceId: +body.id, deployToken: deployToken });
        if (!success) {
            console.log("Device authentication failed with deployToken " + deployToken)
            throw new Error("authentication error");
        }
        await prisma.log.create({
            data: {
                type: "SISTEMA",
                deviceId: +body.id,
                message: `dispositivo ${body.id} autenticado para enviar mensajes`,
            }
        });
        await prisma.device.update({
            where: {
                id: +body.id,
            },
            data: {
                status: "ACTIVE",
            }
        });
        return NextResponse.json({
            message: `device ${body.id} received`,
            jwt: jwt,
        }, { status: 200 });

    } catch (error) {
        console.log("weird")
        return NextResponse.json({
            error: `invalid JSON or empty body`
        }, { status: 400 });
    }
}
