'use client'

import ActionButton from '@/components/button/ActionButton';
import MainLayout from '@/components/layout/MainLayout';
import TransferModal from '@/components/modal/TransferModal';
import { fetcher, put } from '@/util/api';
import { countryCallingCodes } from '@/util/dataset';
import { Autocomplete, Select, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { Plus, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

interface GetEmployeeDTO {
    employeeId: number;
    fullName: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    department: string;
    position: string;
    province: string;
    ward: string;
}

const defaultForm = {
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: '',
    provinceId: '0',
    wardId: '0',
}

export default function EmployeesPage() {
    const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
    const [genderFilter, setGenderFilter] = useState<string | null>(null);
    const [provinceFilter, setProvinceFilter] = useState<string | null>(null);
    const [wardFilter, setWardFilter] = useState<string | null>(null);

    const { data: provinces } = useSWR<{ provinceId: number; provinceName: string }[]>('/api/provinces', fetcher);
    const { data: wards } = useSWR<{ wardId: number; wardName: string }[]>('/api/wards', fetcher);
    const { data: employees } = useSWR<GetEmployeeDTO[]>(
        `/api/employees?dep=${departmentFilter}&gen=${genderFilter}&province=${provinceFilter}&ward=${wardFilter}`, fetcher);
    const { data: departments, error: departmentsError, isLoading: departmentsLoading } = useSWR<{ departmentId: number, name: string }[]>('/api/departments', fetcher);
    const departmentOptions = departments?.map(d => ({ value: d.departmentId.toString(), label: d.name })) || [];
    const provinceOptions = provinces?.map(p => ({ value: p.provinceId.toString(), label: p.provinceName })) || [];
    const wardOptions = wards?.map(w => ({ value: w.wardId.toString(), label: w.wardName })) || [];

    const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState(defaultForm);

    // Transfer modal state
    const [transferModalOpen, setTransferModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<GetEmployeeDTO | null>(null);

    const startEditing = (employee: GetEmployeeDTO) => {
        setEditingEmployeeId(employee.employeeId);
        setEditForm({
            fullName: '',
            email: '',
            phone: '',
            dob: '',
            gender: '',
            provinceId: '0',
            wardId: '0',
        });
    };

    const handleSaveEdit = async (employeeId: number) => {
        try {
            await put(`/api/employees/${employeeId}`, JSON.stringify(editForm));
            await mutate(`/api/employees?dep=${departmentFilter}&gen=${genderFilter}&province=${provinceFilter}&ward=${wardFilter}`);
            setEditingEmployeeId(null);
            setEditForm(defaultForm);
        } catch (error) {
            console.error('Failed to update employee:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingEmployeeId(null);
        setEditForm({
            fullName: '',
            email: '',
            phone: '',
            dob: '',
            gender: '',
            provinceId: '',
            wardId: '',
        });
    };

    return (
        <MainLayout activePath="/">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Employees</h1>
                    <p className="text-gray-700">Manage your employees</p>
                </div>
                <Link href="/employees/add" className="p-2 px-3 transition-colors rounded-lg inline-flex items-center gap-2 hover:bg-gray-200">
                    <Plus size={16} className="cursor-pointer" />
                    Add
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <Select
                            label="Province"
                            placeholder="Select province"
                            description="Choose the province"
                            data={provinceOptions}
                            onChange={(value) => setProvinceFilter(value)}
                            required
                            searchable
                            clearable
                        />
                    </div>
                    <div>
                        <Select
                            label="Ward"
                            description="Choose the ward"
                            placeholder="Select ward"
                            data={wardOptions}
                            onChange={(value) => setWardFilter(value)}
                            required
                            clearable
                            searchable
                        />
                    </div>
                    <div>
                        <Select
                            label="Department"
                            placeholder="Select department"
                            description="Choose the department"
                            data={departmentOptions}
                            clearable
                            onChange={(value) => setDepartmentFilter(value)}
                            searchable
                            required
                        />
                    </div>
                    <div>
                        <Select
                            label="Gender"
                            placeholder="Select gender"
                            description="Choose the gender"
                            data={[{ value: '1', label: 'Male' }, { value: '2', label: 'Female' }]}
                            clearable
                            onChange={(value) => setGenderFilter(value)}
                            searchable
                            required
                        />
                    </div>
                </div>
            </div>

            {/* Employees Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Full Name</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Date of Birth</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Gender</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Province</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Ward</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Email</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Phone</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Department</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Position</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {employees?.map((employee) => (
                                <tr key={employee.employeeId} className="hover:bg-gray-50">
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                                {employee.fullName.split(' ').map(name => name[0]).join('')}
                                            </div>
                                            <div>
                                                {editingEmployeeId === employee.employeeId ? (
                                                    <TextInput
                                                        description={employee.fullName}
                                                        value={editForm.fullName}
                                                        onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                                                        size="xs"
                                                    />
                                                ) : (
                                                    <Link href={`/employees/${employee.employeeId}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                                                        {employee.fullName}
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        {editingEmployeeId === employee.employeeId ? (
                                            <DateInput
                                                description={new Date(employee.dob).toLocaleDateString()}
                                                value={editForm.dob ? new Date(editForm.dob) : null}
                                                onChange={(date) => setEditForm({ ...editForm, dob: date ? date.toString() : '' })}
                                                size="xs"
                                                valueFormat="DD/MM/YYYY"
                                            />
                                        ) : (
                                            new Date(employee.dob).toLocaleDateString()
                                        )}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        {editingEmployeeId === employee.employeeId ? (
                                            <Select
                                                description={employee.gender}
                                                value={editForm.gender}
                                                onChange={(value) => setEditForm({ ...editForm, gender: value || '' })}
                                                data={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }]}
                                                size="xs"
                                            />
                                        ) : (
                                            employee.gender
                                        )}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        {editingEmployeeId === employee.employeeId ? (
                                            <Select
                                                description={employee.province}
                                                onChange={(value) => setEditForm({ ...editForm, provinceId: value || '' })}
                                                data={provinceOptions}
                                                size="xs"
                                                searchable
                                            />
                                        ) : (
                                            employee.province
                                        )}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        {editingEmployeeId === employee.employeeId ? (
                                            <Select
                                                description={employee.ward}
                                                onChange={(value) => setEditForm({ ...editForm, wardId: value || '' })}
                                                data={wardOptions}
                                                size="xs"
                                                searchable
                                            />
                                        ) : (
                                            employee.ward
                                        )}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        {editingEmployeeId === employee.employeeId ? (
                                            <TextInput
                                                description={employee.email}
                                                value={editForm.email}
                                                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                                                size="xs"
                                            />
                                        ) : (
                                            employee.email
                                        )}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        {editingEmployeeId === employee.employeeId ? (
                                            <Autocomplete
                                                description={employee.phone}
                                                data={countryCallingCodes}
                                                value={editForm.phone}
                                                onChange={(e) => setEditForm({ ...editForm, phone: e })}
                                                size="xs"
                                            />
                                        ) : (
                                            employee.phone
                                        )}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        {employee.department}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        {employee.position}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        <div className="flex items-center gap-2">
                                            {editingEmployeeId === employee.employeeId ? (
                                                <>
                                                    <ActionButton
                                                        kind="check"
                                                        onClick={() => handleSaveEdit(employee.employeeId)}
                                                    />
                                                    <ActionButton
                                                        kind="cancel"
                                                        onClick={handleCancelEdit}
                                                    />
                                                </>
                                            ) : (
                                                <>
                                                    <ActionButton
                                                        kind="edit"
                                                        onClick={() => startEditing(employee)}
                                                    />
                                                    <button
                                                        className="p-2 rounded-full"
                                                        onClick={() => {
                                                            setSelectedEmployee(employee);
                                                            setTransferModalOpen(true);
                                                        }}
                                                        title="Transfer employee"
                                                    >
                                                        <RefreshCw size={16} className="text-gray-600 cursor-pointer" />
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Transfer Modal */}
            {selectedEmployee && (
                <TransferModal
                    isOpen={transferModalOpen}
                    onClose={() => {
                        setTransferModalOpen(false);
                        setSelectedEmployee(null);
                    }}
                    employeeId={selectedEmployee.employeeId}
                    employeeName={selectedEmployee.fullName}
                    currentDepartment={selectedEmployee.department}
                    currentPosition={selectedEmployee.position}
                />
            )}
        </MainLayout>
    );
}