import Link from "next/link";
import Image from "next/image";

export default function LogDetails({ log }) {
    const imgSrc = `data:image/jpeg;base64,${log.image}`;

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
                                <th>LogID</th>
                                <th>{log.id}</th>
                            </tr>
                            <tr>
                                <th>Type</th>
                                <th>{log.type}</th>
                            </tr>
                            <tr>
                                <th>Mensaje completo</th>
                                <th>{log.message}</th>
                            </tr>
                            <tr>
                                <th>ID del dispositivo</th>
                                <th>{log.deviceId}</th>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {log.image &&
                    <div className="flex flex-col gap-4 rounded-box border border-base-content/5 bg-base-200 h-8 items-center">
                        <h1 className="text-center text-xl font-bold">Imágen</h1>
                        <Image src={imgSrc} alt="" width={400} height={400}></Image>
                    </div>
                }
            </div>
        </div>
    )

}
