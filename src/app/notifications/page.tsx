'use client'

import MainLayout from '@/components/layout/MainLayout';
import { Button, Modal, TextInput } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const notificationsData = [
    {
        notificationId: 1,
        content: 'Tăng lương cho bộ phận Kỹ thuật đã được xử lý.',
        notificationDate: '2023-06-15T09:30:00',
    },
    {
        notificationId: 2,
        content: 'Sarah Johnson đã gia nhập bộ phận Marketing.',
        notificationDate: '2023-06-14T14:15:00',
    },
    {
        notificationId: 3,
        content: 'Cuộc họp hàng tháng của bộ phận Nhân sự đã được lên lịch.',
        notificationDate: '2023-06-10T10:00:00',
    },
    {
        notificationId: 4,
        content: 'Tăng lương cho bộ phận Kinh doanh đã được xử lý.',
        notificationDate: '2023-03-15T11:30:00',
    },
    {
        notificationId: 5,
        content: 'Chính sách làm việc từ xa đã được cập nhật. Vui lòng xem xét các thay đổi.',
        notificationDate: '2023-03-10T15:45:00',
    },
    {
        notificationId: 6,
        content: 'Tăng lương cho bộ phận Marketing đã được xử lý.',
        notificationDate: '2022-12-15T10:15:00',
    },
    {
        notificationId: 7,
        content: 'Văn phòng sẽ đóng cửa vào ngày 25 và 26 tháng 12 cho kỳ nghỉ lễ Giáng sinh.',
        notificationDate: '2022-12-01T09:00:00',
    },
    {
        notificationId: 8,
        content: 'Tăng lương cho bộ phận Kỹ thuật đã được xử lý.',
        notificationDate: '2022-09-15T14:30:00',
    },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(notificationsData);
    // const { data: notifications, mutate } = useSWR<{ notificationId: number, content: string, notificationDate: string }[]>('/api/notifications', fetcher);

    // Modal state
    const [opened, { open, close }] = useDisclosure(false);

    // Form for adding new notifications
    const form = useForm({
        initialValues: {
            content: '',
            notificationDate: new Date(),
        },
        validate: {
            content: (value) => (value.length < 5 ? 'Nội dung phải có ít nhất 5 ký tự' : null),
            notificationDate: (value) => (!value ? 'Ngày là bắt buộc' : null),
        },
    });

    // Helper function to format dates
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('vi-VN', {
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
            const monthYear = `${date.toLocaleString('vi-VN', { month: 'long' })} ${date.getFullYear()}`;

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
                    <h1 className="text-2xl font-bold">Thông Báo</h1>
                    <p className="text-gray-600">Đã gửi</p>
                </div>

                <div>
                    <Button
                        onClick={open}
                        leftSection={<Plus size={16} />}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                        Thêm Thông Báo
                    </Button>
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

            {/* Add Notification Modal */}
            <Modal opened={opened} onClose={close} title="Thêm Thông Báo Mới" centered>
                <form onSubmit={form.onSubmit((values) => {
                    // In a real app, this would be an API call
                    // await post('/api/notifications', JSON.stringify(values));

                    // For demo purposes, we'll just add to the local state
                    const newNotification = {
                        notificationId: Math.max(0, ...notifications.map(n => n.notificationId)) + 1,
                        content: values.content,
                        notificationDate: values.notificationDate.toISOString(),
                    };

                    setNotifications([newNotification, ...notifications]);
                    // In a real app with SWR: mutate();

                    form.reset();
                    close();
                })}>
                    <div className="space-y-4">
                        <TextInput
                            label="Nội dung"
                            placeholder="Nhập nội dung thông báo"
                            description="Mô tả chi tiết thông báo"
                            {...form.getInputProps('content')}
                            required
                        />

                        <DateTimePicker
                            label="Ngày và Giờ"
                            placeholder="Chọn ngày và giờ"
                            description="Khi nào thông báo này được ghi ngày"
                            {...form.getInputProps('notificationDate')}
                            required
                        />

                        <div className="flex justify-end gap-4 mt-6">
                            <Button variant="outline" color="gray" onClick={close}>Hủy</Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Thêm Thông Báo</Button>
                        </div>
                    </div>
                </form>
            </Modal>
        </MainLayout>
    );
}