import { NextRequest } from "next/server";
import { getMostRecentLog } from "@/services/logsService"

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const filters = Object.fromEntries(searchParams.entries());
    console.log(`creating a RT connection with filters: ${JSON.stringify(filters)}`)
    let interval: NodeJS.Timeout;
    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder();
            controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ message: "connected" })}\n\n`)
            );
            interval = setInterval(async () => {
                let res;
                res = await getMostRecentLog({ filters: filters });
                const data = {
                    log: res,
                };
                controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
                );
            }, 1000);

        },
        cancel() {
            console.log("SSE client disconected clearing up intervals");
            clearInterval(interval);
        }
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
