"use client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut } from "@/services/authenticationService"
import useAuthStore from "@/stores/authStore"
import { useShallow } from "zustand/shallow"
import { useEffect } from "react"
import { useModal } from "@/context/AlertContext"
import Image from "next/image"

export default function Navbar({ children, isDrawerAbsolute = false }) {
    const { authUserData, fetchAuthUser, errorAuth, cleanStore } = useAuthStore(
        useShallow((state) => ({
            authUserData: state.authUserData,
            fetchAuthUser: state.fetchAuthUser,
            errorAuth: state.error,
            cleanStore: state.cleanStore,
        })));
    useEffect(() => {
        fetchAuthUser();
    }, [fetchAuthUser, errorAuth])
    const router = useRouter();
    const { showConfirm } = useModal();
    const logout = async function() {
        const choice = await showConfirm({ message: "¿Cerrar Sesión?" });
        if (choice) {
            LogOut();
            router.push("/");
            cleanStore();
        }
    }
    return (
        <>
            <div className="navbar h-[5vh] bg-base-300">
                {authUserData &&
                    <label htmlFor="sidebar" className="btn btn-ghost">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
                    </label>

                }
                <div className="flex flex-row">
                    <Link className="btn btn-ghost text-xl text-base-content font-bold" href={"/main_navigation"}>
                        <Image
                            src="/favicon.ico"
                            alt="Logo"
                            width={40}
                            height={40}
                        />

                        RoadAnimals</Link>
                </div>
                {authUserData ?
                    <div className="flex justify-end items-center gap-4 w-full">
                        <li className="btn btn-primary btn-soft btn-sm w-20"><Link href={"/main_navigation/users/myProfile"}>Ver Perfil </Link></li>
                        <li className="btn btn-error btn-soft btn-sm w-20"><button onClick={logout}>Cerrar Sesión</button></li>
                    </div>

                    :
                    <div className="flex justify-end items-center gap-4 w-full">
                        <Link className="btn btn-primary btn-sm w-45" href={"/login"}>Iniciar Sesión</Link>
                    </div>

                }
            </div>
            <div className="flex-none drawer lg:drawer-open bg-base-300 relative">
                <input id="sidebar" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content bg-base-100">
                    {children}
                </div>
                <div className={`drawer-side is-drawer-close:hidden absolute md:${isDrawerAbsolute ? "absolute" : "relative"} z-1000`}>
                    <label htmlFor="sidebar" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-300 min-h-full p-4">
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
                        <li className="font-bold"><Link href={"/"}>Monitorización reciente</Link></li>
                        <li><Link href={"/main_navigation/about"}>Sobre Nosotros</Link></li>
                    </ul>
                </div>
            </div>
        </>
    )
}
