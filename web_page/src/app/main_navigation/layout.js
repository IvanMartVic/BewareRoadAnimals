import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import Navbar from "@/components/navbar";

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
        <div
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
            <Navbar>{children}</Navbar>
        </div>
    );
}
