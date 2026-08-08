import { NextRequest } from "next/server";
import { getMostRecentLog } from "@/services/logsService"
import { prisma } from "@/../lib/prisma";

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const filters = Object.fromEntries(searchParams.entries());
    console.log(`creating a RT connection with filters: ${JSON.stringify(filters)}`)
    let timeout: NodeJS.Timeout;
    let isCancelled = false;
    const stream = new ReadableStream({
        async start(controller) {
            let lastConsultedTimestamp = new Date();
            const encoder = new TextEncoder();
            controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ message: "connected" })}\n\n`)
            );
            const pushNewLogs = async () => {
                let res;
                // res = await getMostRecentLog({ filters: filters });
                res = await prisma.log.findMany({
                    where: {
                        timestamp: {
                            gt: lastConsultedTimestamp
                        },
                        type: "DETECCION"
                    },
                    include: {
                        deviceIn: {
                            select: {
                                coordLatitude: true,
                                coordLength: true,
                            }
                        }
                    },
                    orderBy: {
                        timestamp: 'desc',
                    },
                });

                if (isCancelled || req.signal.aborted) return;

                if (res.length > 0) {
                    const sortedNewLogs = res.sort((a, b) => (b.timestamp.getTime() - a.timestamp.getTime()))
                    lastConsultedTimestamp = new Date(sortedNewLogs[0].timestamp);
                    const data = {
                        logs: sortedNewLogs,
                    };
                    controller.enqueue(
                        encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                    );

                }
            }
            const timeoutFun = async () => {
                await pushNewLogs();
                timeout = setTimeout(timeoutFun, 1000);
            };
            timeoutFun();

        },
        cancel() {
            console.log("SSE client disconected clearing up intervals");
            isCancelled = true;
            clearTimeout(timeout);
        }
    });
    req.signal.addEventListener('abort', () => {
        isCancelled = true;
        clearInterval(timeout);
    });
    return new Response(stream, {
        headers: {
            'Content-type': 'text/event-stream',
            'Cache-control': 'no-cache, no-transform',
            'Connection': 'keep-alive',
            'X-Accel-Buffering': 'no',
        },
    });
}
