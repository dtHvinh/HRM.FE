'use client'

import MainLayout from '@/components/layout/MainLayout';
import { Plus } from 'lucide-react';

const notificationsData = [
    {
        notificationId: 1,
        content: 'Salary increases for Engineering department have been processed.',
        notificationDate: '2023-06-15T09:30:00',
    },
    {
        notificationId: 2,
        content: 'Sarah Johnson has joined the Marketing department.',
        notificationDate: '2023-06-14T14:15:00',
    },
    {
        notificationId: 3,
        content: 'HR department monthly meeting scheduled.',
        notificationDate: '2023-06-10T10:00:00',
    },
    {
        notificationId: 4,
        content: 'Salary increases for Sales department have been processed.',
        notificationDate: '2023-03-15T11:30:00',
    },
    {
        notificationId: 5,
        content: 'Remote work policy has been updated. Please review the changes.',
        notificationDate: '2023-03-10T15:45:00',
    },
    {
        notificationId: 6,
        content: 'Salary increases for Marketing department have been processed.',
        notificationDate: '2022-12-15T10:15:00',
    },
    {
        notificationId: 7,
        content: 'Office will be closed on December 25th and 26th for Christmas holidays.',
        notificationDate: '2022-12-01T09:00:00',
    },
    {
        notificationId: 8,
        content: 'Salary increases for Engineering department have been processed.',
        notificationDate: '2022-09-15T14:30:00',
    },
];

export default function NotificationsPage() {
    const notifications = notificationsData;
    // const { data: notifications } = useSWR<{ notifycationId: number, content: string, notificationDate: string }[]>('/api/notifications', fetcher);

    // Helper function to format dates
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    };

    const groupNotificationsByDate = (notifications: { notificationId: number, content: string, notificationDate: string }[]) => {
        const groups: Record<string, typeof notifications> = {};

        notifications.forEach(notification => {
            const date = new Date(notification.notificationDate);
            const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

            if (!groups[monthYear]) {
                groups[monthYear] = [];
            }

            groups[monthYear].push(notification);
        });

        return groups;
    };

    const groupedNotifications = groupNotificationsByDate(notifications ?? []);

    const getNotificationIcon = () => {
        return (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
            </svg>
        );
    };

    return (
        <MainLayout activePath="/notifications">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <p className="text-gray-600">Sent</p>
                </div>

                <div>
                    <Plus />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                {Object.entries(groupedNotifications).map(([monthYear, notifications]) => (
                    <div key={monthYear}>
                        <div className="bg-gray-50 px-6 py-3">
                            <h2 className="text-sm font-medium text-gray-500">{monthYear}</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.notificationId}
                                    className="p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            {getNotificationIcon()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-gray-500">{formatDate(notification.notificationDate)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{notification.content}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </MainLayout>
    );
}