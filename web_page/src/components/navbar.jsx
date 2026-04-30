"use client"
import Link from "next/link"
import avatar from "@/../public/avatar.jpg"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { LogOut } from "@/services/authenticationService"
import useAuthStore from "@/stores/authStore"
import { useShallow } from "zustand/shallow"
import { useEffect } from "react"

export default function Navbar({ pageContent }) {
    const { authUserData, fetchAuthUser, errorAuth } = useAuthStore(
        useShallow((state) => ({
            authUserData: state.authUserData,
            fetchAuthUser: state.fetchAuthUser,
            errorAuth: state.error,
        })));
    useEffect(() => {
        fetchAuthUser();
        if (errorAuth != null) {
            alert(errorAuth);
        }
    }, [fetchAuthUser, errorAuth])
    const router = useRouter();
    const logout = function() {
        // alert("logging out");
        const choice = confirm("¿Cerrar Sesion?");
        if (choice) {
            LogOut();
            router.push("/");
        }
    }
    return (
        <>
            <div className="navbar bg-base-300">
                <label htmlFor="sidebar" className="btn btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
                </label>
                <div className="flex-1">
                    <Link className="btn btn-ghost text-xl text-base-content font-bold" href={"/main_navigation"}>RoadAnimals</Link>
                </div>
                <div className="flex justify-end items-center gap-4 w-full">
                    <li className="btn btn-primary btn-soft btn-sm w-20"><Link href={"/main_navigation/users/myProfile"}>Ver Perfil </Link></li>
                    <li className="btn btn-error btn-soft btn-sm w-20"><button onClick={logout}>Cerrar Sesión</button></li>
                </div>
            </div>
            <div className="flex-none drawer lg:drawer-open bg-base-300">
                <input id="sidebar" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content bg-base-100">
                    {pageContent}
                </div>
                <div className="drawer-side is-drawer-close:hidden">
                    <label htmlFor="sidebar" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-300 min-h-full w-80 p-4">
                        {/* Sidebar content here */}
                        <li className="font-bold"><Link href={"/main_navigation"}>Página Principal</Link></li>
                        {authUserData && authUserData.role == "ADMIN" &&
                            <li>
                                <details open>
                                    <summary className="font-bold">Usuarios</summary>
                                    <ul>
                                        <li><Link href={"/main_navigation/users"}>Área de Usuarios </Link></li>
                                        <li><Link href={"/main_navigation/users/newUser"}>Nuevo Usuario</Link></li>
                                    </ul>

                                </details>
                            </li>
                        }
                        <li>
                            <details open>
                                <summary className="font-bold">Dispositivos</summary>
                                <ul>
                                    <li><Link href={"/main_navigation/devices"}>Area de Dispositivos</Link></li>
                                    <li><Link href={"/main_navigation/devices/newDevice"}>Nuevo Dipositivo</Link></li>
                                </ul>

                            </details>

                        </li>
                        {authUserData &&
                            <li className="font-bold"><Link href={`/main_navigation/logs?userId=${authUserData.id}`}>Logs</Link></li>
                        }
                        <li><Link href={"/main_navigation/about"}>Sobre Nosotros</Link></li>
                    </ul>
                </div>
            </div>
        </>
    )
}
