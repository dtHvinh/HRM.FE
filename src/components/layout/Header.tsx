import { Tooltip } from "@mantine/core";
import Link from "next/link";

export default function Header() {
    return (
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
            <div className="flex-1 flex justify-end items-center gap-4">
                <div className="relative">
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
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                        </Link>
                    </Tooltip>
                </div>

                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                        JD
                    </div>
                    <span className="font-medium hidden sm:inline-block">John Doe</span>
                </div>
            </div>
        </header>
    );
}