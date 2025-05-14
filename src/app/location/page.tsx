'use client';

import MainLayout from '@/components/layout/MainLayout';
import { del, fetcher, post, put } from '@/util/api';
import { notifyError } from '@/util/toast-util';
import { Button, LoadingOverlay, Modal, TextInput } from '@mantine/core';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export default function LocationPage() {
    const { data: provinces, error: provincesError, isLoading: provincesLoading } = useSWR<{ provinceId: number; provinceName: string }[]>('/api/provinces', fetcher);
    const { data: wards, error: wardsError, isLoading: wardsLoading } = useSWR<{ wardId: number; wardName: string }[]>('/api/wards', fetcher);
    const [showAddProvince, setShowAddProvince] = useState(false);
    const [showAddWard, setShowAddWard] = useState(false);
    const [provinceName, setProvinceName] = useState('');
    const [wardName, setWardName] = useState('');
    const [editProvince, setEditProvince] = useState<{ provinceId: number; provinceName: string } | null>(null);
    const [editWard, setEditWard] = useState<{ wardId: number; wardName: string } | null>(null);

    const handleAddProvince = async () => {
        if (!provinceName.trim()) return;
        try {
            await post('/api/provinces', JSON.stringify({ name: provinceName }))
            mutate('/api/provinces');
            setProvinceName('');
            setShowAddProvince(false);
        } catch (error) {
            notifyError('Failed to add province');
        }
    };

    const handleEditProvince = async () => {
        try {
            await put(`/api/provinces/${editProvince?.provinceId}`, JSON.stringify({ name: provinceName }));
            mutate('/api/provinces');
            setEditProvince(null);
            setProvinceName('');
            setShowAddProvince(false);
        } catch (error) {
            notifyError('Failed to edit province');
        }
    };

    const handleDeleteProvince = async (id: number) => {
        try {
            await del(`/api/provinces/${id}`);
            mutate('/api/provinces');
        } catch (error) {
            notifyError('Failed to delete province');
        }
    };

    const handleAddWard = async () => {
        if (!wardName.trim()) return;
        try {
            await post('/api/wards', JSON.stringify({ name: wardName }))
            mutate('/api/wards');
            setWardName('');
            setShowAddWard(false);
        } catch (error) {
            notifyError('Failed to add ward');
        }
    };

    const handleEditWard = async () => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/wards/${editWard?.wardId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wardName: wardName })
            });
            mutate('/api/wards');
            setEditWard(null);
            setWardName('');
            setShowAddWard(false);
        } catch (error) {
            notifyError('Failed to edit ward');
        }
    };

    const handleDeleteWard = async (id: number) => {
        try {
            await del(`/api/wards/${id}`);
            mutate('/api/wards');
        } catch (error) {
            notifyError('Failed to delete ward');
        }
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
                            onClick={() => { setShowAddProvince(true); setEditProvince(null); setProvinceName(''); }}
                            className="p-2 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Add Province"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                    </div>
                    {provincesError ? (
                        <div className="p-6 text-center text-red-600">Error loading provinces</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {provinces?.map((province) => (
                                    <tr key={province.provinceId} className="hover:bg-gray-50 group">
                                        <td className="px-6 py-3 text-sm text-gray-900">{province.provinceName}</td>
                                        <td className="px-6 py-3 flex gap-2 justify-end">
                                            <button className="text-blue-600 hover:text-blue-800 p-2 rounded transition-colors border group-hover:border-blue-300" onClick={() => { setEditProvince(province); setProvinceName(province.provinceName); setShowAddProvince(true); }} title="Edit">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
                                            </button>
                                            <button className="text-red-600 hover:text-red-800 p-2 rounded transition-colors border group-hover:border-red-300" onClick={() => handleDeleteProvince(province.provinceId)} title="Delete">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
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
                            onClick={() => { setShowAddWard(true); setEditWard(null); setWardName(''); }}
                            className="p-2 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Add Ward"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 5v14M5 12h14" />
                            </svg>
                        </button>
                    </div>
                    {wardsError ? (
                        <div className="p-6 text-center text-red-600">Error loading wards</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {wards?.map((ward) => (
                                    <tr key={ward.wardId} className="hover:bg-gray-50 group">
                                        <td className="px-6 py-3 text-sm text-gray-900">{ward.wardName}</td>
                                        <td className="px-6 py-3 flex gap-2 justify-end">
                                            <button className="text-blue-600 hover:text-blue-800 p-2 rounded transition-colors border group-hover:border-blue-300" onClick={() => { setEditWard(ward); setWardName(ward.wardName); setShowAddWard(true); }} title="Edit">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
                                            </button>
                                            <button className="text-red-600 hover:text-red-800 p-2 rounded transition-colors border group-hover:border-red-300" onClick={() => handleDeleteWard(ward.wardId)} title="Delete">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Province Modal */}
            <Modal opened={showAddProvince} onClose={() => { setShowAddProvince(false); setEditProvince(null); setProvinceName(''); }}
                title={editProvince ? `Edit "${editProvince.provinceName}"` : 'Add Province'} centered>
                <form onSubmit={e => { e.preventDefault(); editProvince ? handleEditProvince() : handleAddProvince(); }} className="space-y-4 px-2">
                    <TextInput
                        label="Province Name"
                        value={provinceName}
                        onChange={e => setProvinceName(e.currentTarget.value)}
                        required
                        autoFocus
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => { setShowAddProvince(false); setEditProvince(null); setProvinceName(''); }}>Cancel</Button>
                        <Button type="submit">{editProvince ? 'Update' : 'Add'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Ward Modal */}
            <Modal opened={showAddWard} onClose={() => { setShowAddWard(false); setEditWard(null); setWardName(''); }} title={editWard ? `Edit "${editWard.wardName}"` : 'Add Ward'} centered>
                <form onSubmit={e => { e.preventDefault(); editWard ? handleEditWard() : handleAddWard(); }} className="space-y-4 px-2">
                    <TextInput
                        label="Ward Name"
                        value={wardName}
                        onChange={e => setWardName(e.currentTarget.value)}
                        required
                        autoFocus
                    />
                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => { setShowAddWard(false); setEditWard(null); setWardName(''); }}>Cancel</Button>
                        <Button type="submit">{editWard ? 'Update' : 'Add'}</Button>
                    </div>
                </form>
            </Modal>
        </MainLayout>
    );
}