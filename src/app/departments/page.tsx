'use client'

import MainLayout from '@/components/layout/MainLayout';
import { del, fetcher, post, put } from '@/util/api';
import { notifyError } from '@/util/toast-util';
import { LoadingOverlay, Text, TextInput } from '@mantine/core';
import { modals } from '@mantine/modals';
import { Check, Plus, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

export default function DepartmentsPage() {
    const { data: departments, error: departmentsError, isLoading: departmentsLoading } = useSWR<{ departmentId: number, name: string }[]>('/api/departments', fetcher);

    const [isAddingDepartment, setIsAddingDepartment] = useState(false);
    const [newDeptName, setNewDeptName] = useState('');

    const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(null);
    const [editDepartmentName, setEditDepartmentName] = useState('');

    const handleAddDepartment = async () => {
        if (!newDeptName.trim()) return;
        try {
            await post('/api/departments', JSON.stringify({ name: newDeptName.trim() }));
            mutate('/api/departments');
            setNewDeptName('');
            setIsAddingDepartment(false);
        } catch (error) {
            notifyError('Failed to add department');
        }
    };

    const handleEditDepartment = async (id: number) => {
        try {
            await put(`/api/departments/${id}`, JSON.stringify({ name: editDepartmentName }));
            mutate('/api/departments');
            setEditingDepartmentId(null);
            setEditDepartmentName('');
        } catch (error) {
            notifyError('Failed to edit department');
        }
    };

    const handleAskDeleteDepartment = (departmentName: string, id: number) => {
        modals.openConfirmModal({
            title: 'Warning',
            centered: true,
            children: (
                <Text size='sm'>
                    Are you sure you want to delete "{departmentName}"?
                </Text>
            ),
            labels: { confirm: `Delete "${departmentName}"`, cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onConfirm: () => handleDeleteDepartment(id),
        });
    }

    const handleDeleteDepartment = async (id: number) => {
        try {
            await del(`/api/departments/${id}`);
            mutate('/api/departments');
        } catch (error) {
            notifyError('Failed to delete department');
        }
    };

    const startEditingDepartment = (department: { departmentId: number; name: string }) => {
        setEditingDepartmentId(department.departmentId);
        setEditDepartmentName(department.name);
    };

    return (
        <MainLayout activePath="/departments">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Departments</h1>
                <p className="text-gray-600">Manage your company departments</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-0 relative min-h-[200px] [&_button]:cursor-pointer">
                    <LoadingOverlay visible={departmentsLoading} />
                    <div className="flex items-center justify-between px-6 pt-6 pb-2">
                        <h2 className="text-lg font-semibold">Departments</h2>
                        <button
                            onClick={() => setIsAddingDepartment(true)}
                            className="p-2 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                            title="Add Department"
                            disabled={isAddingDepartment}
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                    {departmentsError ? (
                        <div className="p-6 text-center text-red-600">Error loading departments</div>
                    ) : (
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {departments?.map((department) => (
                                    <tr key={department.departmentId} className="hover:bg-gray-50 group">
                                        <td className="px-6 py-3 text-sm text-gray-900">
                                            {editingDepartmentId === department.departmentId ? (
                                                <TextInput
                                                    value={editDepartmentName}
                                                    onChange={(e) => setEditDepartmentName(e.currentTarget.value)}
                                                    autoFocus
                                                />
                                            ) : (
                                                department.name
                                            )}
                                        </td>
                                        <td className="px-6 py-3 flex gap-2 justify-end">
                                            {editingDepartmentId === department.departmentId ? (
                                                <>
                                                    <button
                                                        className="text-green-600 hover:text-green-800 p-2 rounded transition-colors border hover:border-green-300"
                                                        onClick={() => handleEditDepartment(department.departmentId)}
                                                        title="Save"
                                                    >
                                                        <Check size={16} />
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-800 p-2 rounded transition-colors border hover:border-red-300"
                                                        onClick={() => {
                                                            setEditingDepartmentId(null);
                                                            setEditDepartmentName('');
                                                        }}
                                                        title="Cancel"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <Link
                                                        href={`/departments/${department.departmentId}`}
                                                        className="text-blue-600 hover:text-blue-800 p-2 rounded transition-colors border group-hover:border-blue-300"
                                                        title="View"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>
                                                    </Link>
                                                    <button
                                                        className="text-blue-600 hover:text-blue-800 p-2 rounded transition-colors border group-hover:border-blue-300"
                                                        onClick={() => startEditingDepartment(department)}
                                                        title="Edit"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19.5 3 21l1.5-4L16.5 3.5z" /></svg>
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-800 p-2 rounded transition-colors border group-hover:border-red-300"
                                                        onClick={() => handleAskDeleteDepartment(department.name, department.departmentId)}
                                                        title="Delete"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {isAddingDepartment && (
                                    <tr className="bg-blue-50">
                                        <td className="px-6 py-3">
                                            <TextInput
                                                value={newDeptName}
                                                onChange={(e) => setNewDeptName(e.currentTarget.value)}
                                                placeholder="Enter department name"
                                                autoFocus
                                            />
                                        </td>
                                        <td className="px-6 py-3 flex gap-2 justify-end">
                                            <button
                                                className="text-green-600 hover:text-green-800 p-2 rounded transition-colors border hover:border-green-300"
                                                onClick={handleAddDepartment}
                                                title="Save"
                                            >
                                                <Check size={16} />
                                            </button>
                                            <button
                                                className="text-red-600 hover:text-red-800 p-2 rounded transition-colors border hover:border-red-300"
                                                onClick={() => {
                                                    setIsAddingDepartment(false);
                                                    setNewDeptName('');
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