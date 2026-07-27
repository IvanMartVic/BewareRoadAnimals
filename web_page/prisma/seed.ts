import "dotenv/config";
import { prisma } from "@/../lib/prisma"
import fs from 'fs';

function randomDate(start: Date, end: Date) {
    const start_millis = start.getTime();
    const end_millis = end.getTime();
    const between_millis = Math.random() * (end_millis - start_millis) + start_millis;
    return new Date(between_millis);
}
async function generateRecentDetection({ numDetect, deviceId }: { numDetect: number, deviceId: number }) {
    const message = '[{"name":"boar","class":18,"confidence":0.68255,"box":{"x1":97.74059,"y1":250.08957,"x2":181.88467,"y2":307.3385}}]'
    for (let i = 0; i < numDetect; i++) {
        const log = await prisma.log.create({
            data: {
                deviceId: deviceId,
                message: message,
                image: "no vacio",
                type: "DETECCION",
            }
        })
    }
}

async function generateLogs({ numDetect, numSys, numBat, deviceId }: { numDetect: number, numSys: number, numBat: number, deviceId: number }) {
    const logTypes = ["DETECCION", "SISTEMA", "BATERIA"];
    const nlogs = [numDetect, numSys, numBat];
    const mockImagePath = "/home/ivan/Downloads/image_mock.jpeg"
    const detection_message = '[{"name":"boar","class":18,"confidence":0.68255,"box":{"x1":97.74059,"y1":250.08957,"x2":181.88467,"y2":307.3385}}]'
    const startDate = new Date(2026, 0, 1)
    const endDate = new Date();
    for (let i = 0; i < nlogs.length; i++) {
        let logType = logTypes[i];
        for (let j = 0; j < nlogs[i]; j++) {
            if (logType == "DETECCION") {
                try {
                    const base64 = fs.readFileSync(mockImagePath, { encoding: 'base64' });
                    const log = await prisma.log.create({
                        data: {
                            deviceId: deviceId,
                            message: detection_message,
                            image: base64,
                            type: logType,
                            timestamp: randomDate(startDate, endDate),
                        }
                    });

                } catch (error) {
                    if (error instanceof Error) {
                        console.error(error.message);
                    }

                }
            } else {
                const log = await prisma.log.create({
                    data: {
                        deviceId: deviceId,
                        message: "creado desde seed",
                        type: logType,
                        timestamp: randomDate(startDate, endDate),
                    }
                });
            }

        }
    }
}
async function generateAdmin() {
    const admin = await prisma.user.findUnique({
        where: { email: "ivan_marvic@usal.es" }
    });
    if (undefined == admin) {
        await prisma.user.create({
            data: {
                full_name: "Ivan Martín Vicente",
                email: "ivan_marvic@usal.es",
                role: "ADMIN",
                password_hash: "79b68b206bff0f54df87d78d10e91f2457d5891deff44e0e3b25c4588eba4e34" //random password
            }
        })
    }
}
async function generateDevice() {
    const device = await prisma.device.findUnique({
        where: {
            id: 17,
        }
    });
    const admin = await prisma.user.findUnique({
        where: { email: "ivan_marvic@usal.es" }
    });
    if (null == admin) {
        console.error("unexpected, admin does not exist, cannot create device");
        return
    }
    if (undefined == device) {
        await prisma.device.create({
            data: {
                id: 17,
                userId: admin.id,
                coordLatitude: 41.81968660543046,
                coordLength: -5.947298033932226,
            }
        })
    }
}
async function main() {
    await generateAdmin();
    await generateDevice();
    await generateRecentDetection({ numDetect: 10, deviceId: 17 });
    // await generateLogs({ numDetect: 200, numSys: 10, numBat: 20, deviceId: 17 })
}
main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
