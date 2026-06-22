import "dotenv/config";
import { prisma } from "@/../lib/prisma"
import fs from 'fs';
import path from 'path';

function randomDate(start: Date, end: Date) {
    const start_millis = start.getTime();
    const end_millis = end.getTime();
    const between_millis = Math.random() * (end_millis - start_millis) + start_millis;
    return new Date(between_millis);
}

async function main() {
    const logTypes = ["DETECCION", "SISTEMA", "BATERIA"];
    const nlogs = [200, 10, 20]
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
                            deviceId: 14,
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
                        deviceId: 14,
                        message: "creado desde seed",
                        type: logType,
                        timestamp: randomDate(startDate, endDate),
                    }
                });
            }

        }

    }


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
