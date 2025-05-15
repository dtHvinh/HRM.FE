'use client';

import MainLayout from '@/components/layout/MainLayout';
import { fetcher } from '@/util/api';
import { Button, Select, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useForm } from '@mantine/form';
import Link from 'next/link';
import useSWR from 'swr';

export default function AddEmployeePage() {
    // Fetch provinces and wards data
    const { data: provinces } = useSWR<{ provinceId: number; provinceName: string }[]>('/api/provinces', fetcher);
    const { data: wards } = useSWR<{ wardId: number; wardName: string }[]>('/api/wards', fetcher);
    const { data: departments } = useSWR<{ departmentId: number; name: string }[]>('/api/departments', fetcher);

    // Transform data for select components
    const provinceOptions = provinces?.map(p => ({ value: p.provinceId.toString(), label: p.provinceName })) || [];
    const wardOptions = wards?.map(w => ({ value: w.wardId.toString(), label: w.wardName })) || [];
    const departmentOptions = departments?.map(d => ({ value: d.departmentId.toString(), label: d.name })) || [];

    const form = useForm({
        initialValues: {
            fullName: '',
            dateOfBirth: null,
            gender: '',
            provinceId: '',
            wardId: '',
            email: '',
            phone: '',
            department: '',
        },

        validate: {
            fullName: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            phone: (value) => (/^\(\+\d{1,3}\) \d+(-\d+)*$/.test(value) ? null : 'Invalid phone number format (+XX) XXXX...'),
            department: (value) => (!value ? 'Please select a department' : null),
            gender: (value) => (!value ? 'Please select a gender' : null),
            dateOfBirth: (value) => (!value ? 'Please select a date of birth' : null),
            provinceId: (value) => (!value ? 'Province is required' : null),
            wardId: (value) => (!value ? 'Ward is required' : null),
        },
    });

    const handleSubmit = form.onSubmit((values) => {
        console.log(values);
    });

    return (
        <MainLayout activePath="/employees">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link
                        href="/employees"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold">Add New Employee</h1>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <TextInput
                                label="Full Name"
                                placeholder="Enter full name (e.g., John Smith)"
                                description="Enter your complete name as it appears on official documents"
                                {...form.getInputProps('fullName')}
                                required
                            />
                        </div>

                        <div>
                            <DateInput
                                label="Date of Birth"
                                placeholder="Select date"
                                description="Must be at least 18 years old"
                                {...form.getInputProps('dateOfBirth')}
                                required
                            />
                        </div>

                        <div>
                            <Select
                                label="Gender"
                                placeholder="Select gender"
                                data={[
                                    { value: 'Male', label: 'Male' },
                                    { value: 'Female', label: 'Female' },
                                ]}
                                {...form.getInputProps('gender')}
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <div className="text-sm font-medium mb-2">Address</div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    label="Province"
                                    placeholder="Select province"
                                    data={provinceOptions}
                                    searchable
                                    nothingFoundMessage="No provinces found"
                                    {...form.getInputProps('provinceId')}
                                    required
                                />

                                <Select
                                    label="Ward"
                                    placeholder="Select ward"
                                    data={wardOptions}
                                    searchable
                                    nothingFoundMessage="No wards found"
                                    {...form.getInputProps('wardId')}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <TextInput
                                label="Email"
                                placeholder="Enter work email"
                                description="Use your professional email address"
                                type="email"
                                {...form.getInputProps('email')}
                                required
                            />
                        </div>

                        <div>
                            <TextInput
                                label="Phone"
                                placeholder="(+XX) XXX-XXXX"
                                description="Enter phone number in international format"
                                {...form.getInputProps('phone')}
                                required
                            />
                        </div>

                        <div className="md:col-span-2">
                            <Select
                                label="Department"
                                placeholder="Select department"
                                description="Choose the department you will be working in"
                                data={departmentOptions}
                                {...form.getInputProps('department')}
                                required
                            />
                        </div>

                        <div className="md:col-span-2 flex justify-end gap-4">
                            <Link href="/employees">
                                <Button variant="outline" color="gray">Cancel</Button>
                            </Link>
                            <button type="submit" className='bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700 transition-colors'>Add Employee</button>
                        </div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}