'use client'

import ActionButton from '@/components/button/ActionButton';
import MainLayout from '@/components/layout/MainLayout';
import { del, fetcher, post, put } from '@/util/api';
import { notifyError } from '@/util/toast-util';
import { LoadingOverlay, Text, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export default function PositionsPage() {
    const { data: positions, error: positionsError, isLoading: positionsLoading } = useSWR<{ positionId: number, name: string }[]>('/api/positions', fetcher);

    const [isAddingPosition, setIsAddingPosition] = useState(false);
    const [newPositionName, setNewPositionName] = useState('');

    const [editingPositionId, setEditingPositionId] = useState<number | null>(null);
    const [editPositionName, setEditPositionName] = useState('');

    const handleAddPosition = async () => {
        if (!newPositionName.trim()) return;
        try {
            await post('/api/positions', JSON.stringify({ name: newPositionName.trim() }));
            mutate('/api/positions');
            setNewPositionName('');
            setIsAddingPosition(false);
        } catch (error) {
            notifyError('Không thể thêm chức vụ');
        }
    };

    const handleEditPosition = async (id: number) => {
        try {
            await put(`/api/positions/${id}`, JSON.stringify({ name: editPositionName }));
            mutate('/api/positions');
            setEditingPositionId(null);
            setEditPositionName('');
        } catch (error) {
            notifyError('Không thể chỉnh sửa chức vụ');
        }
    };

    const handleAskDeletePosition = (positionName: string, id: number) => {
        modals.openConfirmModal({
            title: 'Cảnh báo',
            centered: true,
            children: (
                <Text size='sm'>
                    Bạn có chắc chắn muốn xóa chức vụ "{positionName}"?
                </Text>
            ),
            labels: { confirm: `Xóa "${positionName}"`, cancel: "Không, đừng xóa" },
            confirmProps: { color: 'red' },
            onConfirm: () => handleDeletePosition(id),
        });
    }

    const handleDeletePosition = async (id: number) => {
        try {
            await del(`/api/positions/${id}`);
            mutate('/api/positions');
        } catch (error) {
            notifyError('Không thể xóa chức vụ');
        }
    };

    return (
        <MainLayout activePath="/positions">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Chức Vụ</h1>
                <p className="text-gray-600">Quản lý chức vụ trong công ty của bạn</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-0 relative min-h-[200px] [&_button]:cursor-pointer">
                    <LoadingOverlay visible={positionsLoading} />
                    <div className="flex items-center justify-between px-6 pt-6 pb-2">
                        <h2 className="text-lg font-semibold">Chức Vụ</h2>
                        <button
                            onClick={() => setIsAddingPosition(true)}
                            className="p-2 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Thêm Chức Vụ"
                            disabled={isAddingPosition}
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    {positionsError ? (
                        <div className="p-6 text-center text-red-600">Lỗi khi tải danh sách chức vụ</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Tên</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {positions?.map((position) => (
                                    <tr key={position.positionId} className="hover:bg-gray-50 group">
                                        <td className="px-6 text-sm text-gray-900">
                                            {editingPositionId === position.positionId ? (
                                                <TextInput
                                                    value={editPositionName}
                                                    onChange={(e) => setEditPositionName(e.currentTarget.value)}
                                                    placeholder="Nhập tên chức vụ"
                                                    autoFocus
                                                />
                                            ) : (
                                                position.name
                                            )}
                                        </td>
                                        <td className="px-6 py-3 flex gap-2 justify-end">
                                            {editingPositionId === position.positionId ? (
                                                <>
                                                    <ActionButton kind="check" onClick={() => handleEditPosition(position.positionId)} />
                                                    <ActionButton kind="cancel" onClick={() => {
                                                        setEditingPositionId(null);
                                                        setEditPositionName('');
                                                    }} />
                                                </>
                                            ) : (
                                                <>
                                                    <ActionButton kind="edit" onClick={() => setEditingPositionId(position.positionId)} />
                                                    <ActionButton kind="delete" onClick={() => handleAskDeletePosition(position.name, position.positionId)} />
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {isAddingPosition && (
                                    <tr className="bg-blue-50">
                                        <td className="px-6 py-3">
                                            <TextInput
                                                value={newPositionName}
                                                onChange={(e) => setNewPositionName(e.currentTarget.value)}
                                                placeholder="Nhập tên chức vụ"
                                                autoFocus
                                            />
                                        </td>
                                        <td className="px-6 py-3 flex gap-2 justify-end">
                                            <ActionButton kind="add" onClick={handleAddPosition} />
                                            <ActionButton kind="cancel" onClick={() => {
                                                setIsAddingPosition(false);
                                                setNewPositionName('');
                                            }} />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}