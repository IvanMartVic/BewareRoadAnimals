import Image from "next/image";
import perroPic from "@/../public/perro_gracios.jpeg";

export default function Home() {
  return (
    <div
        className="flex h-screen justify-between items-center p-20">
            <h1 className="text-9xl">Hola mundo</h1>
            <Image src={perroPic} alt=""></Image>
    </div>
  );
}
