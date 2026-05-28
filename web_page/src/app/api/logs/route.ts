import { NextRequest } from "next/server";
import { getAllLogs, getUserLogs } from "@/services/logsService"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const filters = Object.fromEntries(searchParams.entries());
    console.log(`creating a RT connection with filters: ${JSON.stringify(filters)}`)
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ message: "connected" })}\n\n`)
            );
            const interval = setInterval(async () => {
                let res;
                if (filters.userId) {
                    const logFilters = { ...filters };
                    delete logFilters.userId;
                    res = await getUserLogs({ filters: logFilters, userId: +filters.userId });

                } else {
                    res = await getAllLogs({ ...filters });
                }
                const data = {
                    logs: res,
                };
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                );
            }, 1000);

            req.signal.addEventListener('abort', () => {
                clearInterval(interval);
                controller.close();
            });
        },
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
