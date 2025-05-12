import { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';

type MainLayoutProps = {
    children: ReactNode;
    activePath?: string;
};

export default function MainLayout({ children, activePath = '/' }: MainLayoutProps) {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar activePath={activePath} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}