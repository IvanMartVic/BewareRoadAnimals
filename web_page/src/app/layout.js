import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/context/AlertContext";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata = {
    title: "BewareRoadAnimals",
    description: "AI animal detection page",
};

export default function RootLayout({ children }) {
    return (
        <html lang="es" data-theme="roadlight">
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
                <ModalProvider>
                    {children}
                </ModalProvider>
            </body>
        </html>
    );
}
