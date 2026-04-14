import "dotenv/config";
import { prisma } from "@/../lib/prisma"

async function main() {
    const logTypes = ["DETECCION", "SISTEMA", "BATERIA", "ALERTA"]; 
    for(let i=0; i<20; i++){
        const j = Math.floor(Math.random() * logTypes.length);
        const log = await prisma.log.create({
            data:{
                deviceId:14,
                message:"creado desde seed",
                image:"",
                type:logTypes[j],
            }

        });


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
