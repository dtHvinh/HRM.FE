import MainLayout from '@/components/layout/MainLayout';

const notificationsData = [
    {
        id: 1,
        description: 'Salary increases for Engineering department have been processed.',
        date: '2023-06-15T09:30:00',
    },
    {
        id: 2,
        description: 'Sarah Johnson has joined the Marketing department.',
        date: '2023-06-14T14:15:00',
    },
    {
        id: 3,
        description: 'HR department monthly meeting scheduled.',
        date: '2023-06-10T10:00:00',
    },
    {
        id: 4,
        description: 'Salary increases for Sales department have been processed.',
        date: '2023-03-15T11:30:00',
    },
    {
        id: 5,
        description: 'Remote work policy has been updated. Please review the changes.',
        date: '2023-03-10T15:45:00',
    },
    {
        id: 6,
        description: 'Salary increases for Marketing department have been processed.',
        date: '2022-12-15T10:15:00',
    },
    {
        id: 7,
        description: 'Office will be closed on December 25th and 26th for Christmas holidays.',
        date: '2022-12-01T09:00:00',
    },
    {
        id: 8,
        description: 'Salary increases for Engineering department have been processed.',
        date: '2022-09-15T14:30:00',
    },
];

export default function NotificationsPage() {
    // In a real application, this would be server-side or use React Query
    const notifications = notificationsData;

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

    // Helper function to group notifications by month/year
    const groupNotificationsByDate = (notifications: typeof notificationsData) => {
        const groups: Record<string, typeof notificationsData> = {};

        notifications.forEach(notification => {
            const date = new Date(notification.date);
            const monthYear = `${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}`;

            if (!groups[monthYear]) {
                groups[monthYear] = [];
            }

            groups[monthYear].push(notification);
        });

        return groups;
    };

    const groupedNotifications = groupNotificationsByDate(notifications);

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
                    <p className="text-gray-600">Stay updated with important announcements</p>
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
                                    key={notification.id}
                                    className="p-6 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="flex-shrink-0">
                                            {getNotificationIcon()}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                                            </div>
                                            <p className="text-sm text-gray-600">{notification.description}</p>
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