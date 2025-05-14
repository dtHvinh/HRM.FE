'use client';

import MainLayout from '@/components/layout/MainLayout';
import { del, fetcher, post, put } from '@/util/api';
import { notifyError } from '@/util/toast-util';
import { LoadingOverlay, Text, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { Check, Plus, X } from 'lucide-react';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export default function LocationPage() {
    const { data: provinces, error: provincesError, isLoading: provincesLoading } = useSWR<{ provinceId: number; provinceName: string }[]>('/api/provinces', fetcher);
    const { data: wards, error: wardsError, isLoading: wardsLoading } = useSWR<{ wardId: number; wardName: string }[]>('/api/wards', fetcher);

    // State for inline editing
    const [isAddingProvince, setIsAddingProvince] = useState(false);
    const [isAddingWard, setIsAddingWard] = useState(false);
    const [newProvinceName, setNewProvinceName] = useState('');
    const [newWardName, setNewWardName] = useState('');

    // State for editing existing items
    const [editingProvinceId, setEditingProvinceId] = useState<number | null>(null);
    const [editingWardId, setEditingWardId] = useState<number | null>(null);
    const [editProvinceName, setEditProvinceName] = useState('');
    const [editWardName, setEditWardName] = useState('');

    const handleAddProvince = async () => {
        if (!newProvinceName.trim()) return;
        try {
            await post('/api/provinces', JSON.stringify({ name: newProvinceName }))
            mutate('/api/provinces');
            setNewProvinceName('');
            setIsAddingProvince(false);
        } catch (error) {
            notifyError('Failed to add province');
        }
    };

    const handleEditProvince = async (id: number) => {
        try {
            await put(`/api/provinces/${id}`, JSON.stringify({ name: editProvinceName }));
            mutate('/api/provinces');
            setEditingProvinceId(null);
            setEditProvinceName('');
        } catch (error) {
            notifyError('Failed to edit province');
        }
    };

    const handleAskDeleteProvince = (provinceName: string, id: number) => {
        modals.openConfirmModal({
            title: 'Warning',
            centered: true,
            children: (
                <Text size='sm'>
                    Are you sure you want to delete "{provinceName}"?
                </Text>
            ),
            labels: { confirm: `Delete "${provinceName}"`, cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onConfirm: () => handleDeleteProvince(id),
        });
    }

    const handleDeleteProvince = async (id: number) => {
        try {
            await del(`/api/provinces/${id}`);
            mutate('/api/provinces');
        } catch (error) {
            notifyError('Failed to delete province');
        }
    };

    const handleAddWard = async () => {
        if (!newWardName.trim()) return;
        try {
            await post('/api/wards', JSON.stringify({ name: newWardName }))
            mutate('/api/wards');
            setNewWardName('');
            setIsAddingWard(false);
        } catch (error) {
            notifyError('Failed to add ward');
        }
    };

    const handleEditWard = async (id: number) => {
        try {
            await put(`/api/wards/${id}`, JSON.stringify({ wardName: editWardName }));
            mutate('/api/wards');
            setEditingWardId(null);
            setEditWardName('');
        } catch (error) {
            notifyError('Failed to edit ward');
        }
    };

    const handleAskDeleteWard = (wardName: string, id: number) => {
        modals.openConfirmModal({
            title: 'Warning',
            centered: true,
            children: (
                <Text size='sm'>
                    Are you sure you want to delete "{wardName}"?
                </Text>
            ),
            labels: { confirm: `Delete "${wardName}"`, cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onConfirm: () => handleDeleteWard(id),
        });
    }

    const handleDeleteWard = async (id: number) => {
        try {
            await del(`/api/wards/${id}`);
            mutate('/api/wards');
        } catch (error) {
            notifyError('Failed to delete ward');
        }
    };

    const startEditingProvince = (province: { provinceId: number; provinceName: string }) => {
        setEditingProvinceId(province.provinceId);
        setEditProvinceName(province.provinceName);
    };

    const startEditingWard = (ward: { wardId: number; wardName: string }) => {
        setEditingWardId(ward.wardId);
        setEditWardName(ward.wardName);
    };

    return (
        <MainLayout activePath="/location">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Location Management</h1>
                <p className="text-gray-600">Manage Provinces and Wards</p>
            </div>

            <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
                {/* Provinces Table */}
                <div className="p-0 mb-8 md:mb-0 relative min-h-[200px]">
                    <LoadingOverlay visible={provincesLoading} />
                    <div className="flex items-center justify-between px-6 pt-6 pb-2">
                        <h2 className="text-lg font-semibold">Provinces</h2>
                        <button
                            onClick={() => setIsAddingProvince(true)}
                            className="p-2 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Add Province"
                            disabled={isAddingProvince}
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    {provincesError ? (
                        <div className="p-6 text-center text-red-600">Error loading provinces</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {provinces?.map((province) => (
                                    <tr key={province.provinceId} className="hover:bg-gray-50 group">
                                        <td className="px-6 py-3 text-sm text-gray-900">
                                            {editingProvinceId === province.provinceId ? (
                                                <TextInput
                                                    value={editProvinceName}
                                                    onChange={(e) => setEditProvinceName(e.currentTarget.value)}
                                                    autoFocus
                                                />
                                            ) : (
                                                province.provinceName
                                            )}
                                        </td>
                                        <td className="px-6 py-3 flex gap-2 justify-end">
                                            {editingProvinceId === province.provinceId ? (
                                                <>
                                                    <button
                                                        className="text-green-600 hover:text-green-800 p-2 rounded transition-colors border hover:border-green-300"
                                                        onClick={() => handleEditProvince(province.provinceId)}
                                                        title="Save"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-800 p-2 rounded transition-colors border hover:border-red-300"
                                                        onClick={() => {
                                                            setEditingProvinceId(null);
                                                            setEditProvinceName('');
                                                        }}
                                                        title="Cancel"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="text-blue-600 hover:text-blue-800 p-2 rounded transition-colors border group-hover:border-blue-300"
                                                        onClick={() => startEditingProvince(province)}
                                                        title="Edit"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-800 p-2 rounded transition-colors border group-hover:border-red-300"
                                                        onClick={() => handleAskDeleteProvince(province.provinceName, province.provinceId)}
                                                        title="Delete"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {isAddingProvince && (
                                    <tr className="bg-blue-50">
                                        <td className="px-6 py-3">
                                            <TextInput
                                                value={newProvinceName}
                                                onChange={(e) => setNewProvinceName(e.currentTarget.value)}
                                                placeholder="Enter province name"
                                                autoFocus
                                            />
                                        </td>
                                        <td className="px-6 py-3 flex gap-2 justify-end">
                                            <button
                                                className="text-green-600 hover:text-green-800 p-2 rounded transition-colors border hover:border-green-300"
                                                onClick={handleAddProvince}
                                                title="Save"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800 p-2 rounded transition-colors border hover:border-red-300"
                                                onClick={() => {
                                                    setIsAddingProvince(false);
                                                    setNewProvinceName('');
                                                }}
                                                title="Cancel"
                                            >
                                                <X size={16} />
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Wards Table */}
                <div className="p-0 relative">
                    <LoadingOverlay visible={wardsLoading} />
                    <div className="flex items-center justify-between px-6 pt-6 pb-2">
                        <h2 className="text-lg font-semibold">Wards</h2>
                        <button
                            onClick={() => setIsAddingWard(true)}
                            className="p-2 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Add Ward"
                            disabled={isAddingWard}
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    {wardsError ? (
                        <div className="p-6 text-center text-red-600">Error loading wards</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {wards?.map((ward) => (
                                    <tr key={ward.wardId} className="hover:bg-gray-50 group">
                                        <td className="px-6 py-3 text-sm text-gray-900">
                                            {editingWardId === ward.wardId ? (
                                                <TextInput
                                                    value={editWardName}
                                                    onChange={(e) => setEditWardName(e.currentTarget.value)}
                                                    autoFocus
                                                />
                                            ) : (
                                                ward.wardName
                                            )}
                                        </td>
                                        <td className="px-6 py-3 flex gap-2 justify-end">
                                            {editingWardId === ward.wardId ? (
                                                <>
                                                    <button
                                                        className="text-green-600 hover:text-green-800 p-2 rounded transition-colors border hover:border-green-300"
                                                        onClick={() => handleEditWard(ward.wardId)}
                                                        title="Save"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-800 p-2 rounded transition-colors border hover:border-red-300"
                                                        onClick={() => {
                                                            setEditingWardId(null);
                                                            setEditWardName('');
                                                        }}
                                                        title="Cancel"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        className="text-blue-600 hover:text-blue-800 p-2 rounded transition-colors border group-hover:border-blue-300"
                                                        onClick={() => startEditingWard(ward)}
                                                        title="Edit"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-800 p-2 rounded transition-colors border group-hover:border-red-300"
                                                        onClick={() => handleAskDeleteWard(ward.wardName, ward.wardId)}
                                                        title="Delete"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {isAddingWard && (
                                    <tr className="bg-blue-50">
                                        <td className="px-6 py-3">
                                            <TextInput
                                                value={newWardName}
                                                onChange={(e) => setNewWardName(e.currentTarget.value)}
                                                placeholder="Enter ward name"
                                                autoFocus
                                            />
                                        </td>
                                        <td className="px-6 py-3 flex gap-2 justify-end">
                                            <button
                                                className="text-green-600 hover:text-green-800 p-2 rounded transition-colors border hover:border-green-300"
                                                onClick={handleAddWard}
                                                title="Save"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800 p-2 rounded transition-colors border hover:border-red-300"
                                                onClick={() => {
                                                    setIsAddingWard(false);
                                                    setNewWardName('');
                                                }}
                                                title="Cancel"
                                            >
                                                <X size={16} />
                                            </button>
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