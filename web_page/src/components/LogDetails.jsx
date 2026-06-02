import Link from "next/link";
import NextImage from 'next/image'
import { useState, useEffect } from "react";

export default function LogDetails({ log }) {
    // const imgSrc = `data:image/jpeg;base64,${log.image}`;
    const [img, setImg] = useState(null);

    function detectionDetails() {
        if (log.type == "DETECCION") {
            return JSON.parse(log.message);
        } else {
            return {};
        }
    }
    const details = detectionDetails();
    async function drawDetectionRects(base64str, rects) {
        const img = await new Promise((resolve, reject) => {
            const image = new Image();
            image.src = base64str;
            image.onload = () => resolve(image);
            image.onerror = (err) => reject(new Error("Failed to load image " + err.message));
        });
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        rects.forEach(({ box, name, color = "green", lineWidth = 4 }) => {
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.strokeRect(box.x1, box.y1, box.x2 - box.x1, box.y2 - box.y1);
            const fontSize = 16;
            const textX = box.x1;
            const textY = box.y2 + 4 + fontSize;
            ctx.fillStyle = color;
            ctx.font = `bold ${fontSize}px sans-serif`;
            ctx.fillText(name, textX, textY);
        });
        const updatedImg = canvas.toDataURL('image/jpeg');
        return updatedImg;
    }
    useEffect(() => {
        if (!log || !log.image) return;
        const process_image = async () => {
            const initial_base64 = `data:image/jpeg;base64,${log.image}`
            try {
                // const drawnImage = await drawDetectionRects(initial_base64, [{x:0,y:0,width:200,height:300}]);
                const drawnImage = await drawDetectionRects(initial_base64, JSON.parse(log.message));
                setImg(drawnImage);

            } catch (error) {
                console.error("failed to edit image" + error.message);
                setImg(initial_base64);
            }
        };
        process_image();
    }, [log, log.image, setImg]);



    return (

        <div className="card bg-base-100 w-full shadow-accent">
            <div className="card-body">
                <div className="overflow-auto h-full w-full rounded-box border border-base-100 bg-base-200 shadow-neutral-500">
                    <table className="table">
                        <thead className="bg-primary text-primary-content">
                            <tr>
                                <th>Información del log</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Type</th>
                                <th>{log.type}</th>
                            </tr>
                            {!log.image ?
                                <tr>
                                    <th>Mensaje completo</th>
                                    <th>{log.message}</th>
                                </tr>
                                :
                                (
                                    <>
                                        <tr>
                                            <th>cantidad de detecciones</th>
                                            <th>{details.length}</th>
                                        </tr>
                                        <tr>
                                            <th>nombres</th>
                                            <th>{details.map((d) => d.name).join(", ")}</th>
                                        </tr>
                                    </>

                                )
                            }
                            <tr>
                                <th>ID del dispositivo</th>
                                <th >
                                    <a href={`/main_navigation/devices/deviceDetails/${log.deviceId}`} className="text-primary">{log.deviceId}</a> </th>
                            </tr>
                            <tr>
                                <th>Hora</th>
                                <th>{log.timestamp.getHours()}:{log.timestamp.getMinutes()}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {log.image && img &&
                    <div className="flex flex-col gap-4 rounded-box border border-base-content/5 bg-base-200 h-8 items-center">
                        <h1 className="text-center text-xl font-bold">Imágen</h1>
                        <NextImage src={img} alt="" width={400} height={400}></NextImage>
                    </div>
                }
            </div>
        </div>
    )

}
