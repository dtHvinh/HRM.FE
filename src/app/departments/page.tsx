'use client'

import MainLayout from '@/components/layout/MainLayout';
import { Modal } from '@mantine/core';
import Link from 'next/link';
import { useState } from 'react';

const departmentsData = [
    {
        id: 1,
        name: 'Engineering',
        employeeCount: 42
    },
    {
        id: 2,
        name: 'Marketing',
        employeeCount: 18
    },
    {
        id: 3,
        name: 'Sales',
        employeeCount: 24
    },
    {
        id: 4,
        name: 'Human Resources',
        employeeCount: 12
    },
    {
        id: 5,
        name: 'Finance',
        employeeCount: 15
    },
    {
        id: 6,
        name: 'Customer Support',
        employeeCount: 20
    },
    {
        id: 7,
        name: 'Research & Development',
        employeeCount: 16
    },
    {
        id: 8,
        name: 'Legal',
        employeeCount: 6
    },
];

export default function DepartmentsPage() {
    const departments = departmentsData;
    const [showAddModal, setShowAddModal] = useState(false);
    const [newDeptName, setNewDeptName] = useState('');

    const handleAddDepartment = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newDeptName.trim()) return;
        console.log('Add department:', newDeptName);
        setShowAddModal(false);
        setNewDeptName('');
    };

    return (
        <MainLayout activePath="/departments">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Departments</h1>
                    <p className="text-gray-600">Manage your company departments</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                    </svg>
                    Add Department
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departments.map((department) => (
                    <div key={department.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-semibold">{department.name}</h2>
                                <span className="p-2 bg-purple-50 rounded-full text-purple-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                                        <path d="M13 5v2" />
                                        <path d="M13 17v2" />
                                        <path d="M13 11v2" />
                                    </svg>
                                </span>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 mr-2">
                                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                        <circle cx="9" cy="7" r="4" />
                                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                    </svg>
                                    <span className="text-sm text-gray-600">{department.employeeCount} employees</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-6 py-3 flex justify-end">
                            <Link href={`/departments/${department.id}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                                View
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <Modal opened={showAddModal} onClose={() => setShowAddModal(false)} title="Add Department" centered>
                <form onSubmit={(e) => { e.preventDefault(); }} className="space-y-4 px-2">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Department name:</label>
                        <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2" required />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Add
                        </button>
                    </div>
                </form>
            </Modal>
        </MainLayout>
    );
}