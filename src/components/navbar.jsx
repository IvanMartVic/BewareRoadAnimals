"use client"
import Link from "next/link"
import avatar from "@/../public/avatar.jpg"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function Navbar({ pageContent }) {
    const router = useRouter();
    const logout = function() {
        alert("logging out");
        router.push("/login");
    }
    return (
        <>
            <div className="navbar bg-base-100">
                <label htmlFor="sidebar" className="btn btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
                </label>
                <div className="flex-1">
                    <Link className="btn btn-ghost text-xl" href={"/"}>RoadAnimals</Link>

                </div>
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar mr-5">
                        <div className="w-10 rounded-full">
                            <Image src={avatar} alt=""></Image>
                        </div>

                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu dropdown-content bg-base-200 rounded-box z-1 mt-4 w-52 p-2 shadow-sm">
                        <li className="btn btn-primary mb-5"><Link href={"/users/myProfile"}>Ver Perfil </Link></li>
                        <li className="btn btn-secondary"><button onClick={logout}>Cerrar Sesión</button></li>
                    </ul>
                </div>
            </div>
            <div className="flex-none drawer lg:drawer-open">
                <input id="sidebar" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {pageContent}
                </div>
                <div className="drawer-side is-drawer-close:hidden">
                    <label htmlFor="sidebar" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 min-h-full w-80 p-4">
                        {/* Sidebar content here */}
                        <li>
                            <details open>
                                <summary className="font-bold">Usuarios</summary>
                                <ul>
                                    <li><Link href={"/users"}>Área de usuarios </Link></li>
                                    <li><Link href={"/users/newUser"}>Nuevo Usuario</Link></li>
                                </ul>

                            </details>

                        </li>
                        <li>
                            <details open>
                                <summary className="font-bold">Dispositivos</summary>
                                <ul>
                                    <li><Link href={"/devices"}>Area de dispositivos</Link></li>
                                    <li><Link href={"/devices/newDevice"}>Nuevo Dipositivo</Link></li>
                                </ul>

                            </details>

                        </li>
                        <li><Link href={"/about"}>Sobre nosotros</Link></li>
                    </ul>
                </div>
            </div>
        </>
    )
}
