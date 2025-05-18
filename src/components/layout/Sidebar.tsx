'use client'

import { Burger, Drawer } from '@mantine/core';
import Link from 'next/link';
import { ReactNode, useState } from 'react';

type NavItemProps = {
    href: string;
    icon: ReactNode;
    label: string;
    active?: boolean;
};

const NavItem = ({ href, icon, label, active }: NavItemProps) => {
    return (
        <Link
            href={href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active ? 'bg-gray-100 text-blue-600' : 'hover:bg-gray-50'}`}
        >
            <span className="text-gray-500">{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    );
};

type SidebarProps = {
    activePath?: string;
};

export default function Sidebar({ activePath = '/' }: SidebarProps) {
    const [opened, setOpened] = useState(false);

    const navItems = [
        {
            href: '/',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
            ),
            label: 'Employees',
        },
        {
            href: '/departments',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                    <path d="M13 5v2" />
                    <path d="M13 17v2" />
                    <path d="M13 11v2" />
                </svg>
            ),
            label: 'Departments',
        },
        {
            href: '/benefits',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
            ),
            label: 'Benefits',
        },
        {
            href: '/positions',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h1" />
                    <path d="M17 3h1a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-1" />
                    <path d="M12 8v13" />
                    <path d="M12 3v3" />
                </svg>
            ),
            label: 'Positions',
        },
        {
            href: '/notifications',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
            ),
            label: 'Notifications',
        },
        {
            href: '/accounts',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 7h-9" />
                    <path d="M14 17H5" />
                    <circle cx="17" cy="17" r="3" />
                    <circle cx="7" cy="7" r="3" />
                </svg>
            ),
            label: 'Accounts',
        },
        {
            href: '/location',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="10" r="3" />
                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                </svg>
            ),
            label: 'Location',
        },
    ];

    const SidebarContent = () => (
        <div className="h-full bg-white p-4">
            <div className="flex items-center gap-2 mb-8 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                    <path d="M16 7h.01" />
                    <path d="M3.4 18H12a8 8 0 0 0 8-8V7a4 4 0 0 0-7.28-2.3L2 20" />
                    <path d="m20 7 2 .5-2 .5" />
                    <path d="M10 18v3" />
                    <path d="M14 17.75V21" />
                    <path d="M7 18a6 6 0 0 0 3.84-10.61" />
                </svg>
                <h1 className="text-xl font-bold">HRM System</h1>
            </div>
            <nav className="space-y-1 text-black [&>*:nth-child(5)]:border-t-[1px] [&>*:nth-child(5)]:rounded-t-none">
                {navItems.map((item) => (
                    <NavItem
                        key={item.href}
                        href={item.href}
                        icon={item.icon}
                        label={item.label}
                        active={activePath === item.href}
                    />
                ))}
            </nav>
        </div>
    );

    return (
        <>
            <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                className="fixed top-4 left-4 md:hidden z-50"
            />
            <Drawer
                opened={opened}
                onClose={() => setOpened(false)}
                size="xs"
                className="md:hidden"
            >
                <SidebarContent />
            </Drawer>
            <aside className="w-64 h-screen bg-white border-r border-gray-200 hidden md:block">
                <SidebarContent />
            </aside>
        </>
    );
}