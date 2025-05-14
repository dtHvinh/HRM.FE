'use client'

import { clearAuth } from "@/context/AuthProvider";
import { Tooltip } from "@mantine/core";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
    const router = useRouter();

    return (
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
            <div className="flex-1 flex justify-end items-center gap-8">
                <Tooltip label="Notifications">
                    <Link
                        href="/notifications"
                        className="p-2 rounded-full hover:bg-gray-100 block"
                        aria-label="Notifications"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                        </svg>
                    </Link>
                </Tooltip>
                <Tooltip label="Logout">
                    <button onClick={() => {
                        clearAuth();
                        router.push("/auth/login");
                    }} className="rounded-full hover:bg-gray-100 block"><LogOut /></button>
                </Tooltip>
            </div>
        </header>
    );
}