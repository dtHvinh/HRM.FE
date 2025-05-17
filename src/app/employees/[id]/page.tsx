'use client'

import SalaryManagement from '@/components/employee/SalaryManagement';
import MainLayout from '@/components/layout/MainLayout';
import { fetcher } from '@/util/api';
import { Badge, Card, Divider, LoadingOverlay, Text, Timeline } from '@mantine/core';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import useSWR from 'swr';

interface GetDepartmentDTO {
    departmentId: number;
    name: string;
    transferInDate: string;
    transferOutDate: string;
    appointmentDate: string;
    position: string;
}

interface GetEmployeeDetailResponse {
    employeeId: number;
    fullName: string;
    dob: string;
    gender: string;
    email: string;
    phone: string;
    position: string;
    province: string;
    ward: string;
    departments: GetDepartmentDTO[];
}

// Employee detail page component

export default function EmployeeDetailPage() {
    const params = useParams();
    const employeeId = params.id as string;

    const { data: employee, error, isLoading, mutate } = useSWR<GetEmployeeDetailResponse>(
        `/api/employees/${employeeId}`,
        fetcher
    );

    // Employee data fetching


    if (isLoading) {
        return (
            <MainLayout activePath="/">
                <div className="relative min-h-[400px]">
                    <LoadingOverlay visible={true} />
                </div>
            </MainLayout>
        );
    }

    // Format date for display

    if (error) {
        return (
            <MainLayout activePath="/">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-center text-red-600">
                        <h2 className="text-xl font-semibold mb-2">Error</h2>
                        <p>Failed to load employee details. Please try again later.</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    if (!employee) {
        return (
            <MainLayout activePath="/">
                <div className="bg-white rounded-lg shadow-sm p-6">
                    <div className="text-center text-gray-600">
                        <h2 className="text-xl font-semibold mb-2">Employee Not Found</h2>
                        <p>The employee you're looking for doesn't exist or has been removed.</p>
                    </div>
                </div>
            </MainLayout>
        );
    }

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Present';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <MainLayout activePath="/">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link
                        href="/"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold">Employee Details</h1>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left column - Personal Information */}
                <div className="lg:col-span-1">
                    <Card padding="lg" radius="md" >
                        <div className="flex flex-col items-center mb-6">
                            <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-semibold mb-4">
                                {employee.fullName.split(' ').map(name => name[0]).join('')}
                            </div>
                            <h2 className="text-xl font-bold text-center">{employee.fullName}</h2>
                            <Badge color="blue" variant="light" size="lg" className="mt-2">
                                {employee.position}
                            </Badge>
                        </div>

                        <Divider label="Personal Information" labelPosition="center" className="my-4" />

                        <div className="space-y-4">
                            <div>
                                <Text size="sm" c="dimmed">Date of Birth</Text>
                                <Text>{formatDate(employee.dob)}</Text>
                            </div>

                            <div>
                                <Text size="sm" c="dimmed">Gender</Text>
                                <Text>{employee.gender}</Text>
                            </div>

                            <div>
                                <Text size="sm" c="dimmed">Location</Text>
                                <Text>{employee.ward}, {employee.province}</Text>
                            </div>
                        </div>
                    </Card>

                    <Card padding="lg" radius="md" className="mb-6">
                        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <Text size="sm" c="dimmed">Email Address</Text>
                                <div className="flex items-center mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-500">
                                        <rect width="20" height="16" x="2" y="4" rx="2" />
                                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                                    </svg>
                                    <Text>{employee.email}</Text>
                                </div>
                            </div>

                            <div>
                                <Text size="sm" c="dimmed">Phone Number</Text>
                                <div className="flex items-center mt-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-gray-500">
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                                    </svg>
                                    <Text>{employee.phone}</Text>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right column - Contact & Department Information */}
                <div className="lg:col-span-2">
                    <div className='max-h-96 overflow-y-auto'>
                        <Card padding="lg" radius="md" className="mt-6">
                            <SalaryManagement employeeId={employeeId} />
                        </Card>
                    </div>

                    <div className='max-h-96 overflow-y-auto'>
                        <Card padding="lg" radius="md">
                            <h3 className="text-lg font-semibold mb-4">Department History</h3>

                            {employee.departments.length === 0 ? (
                                <div className="text-center py-4 text-gray-500">
                                    Not assigned to any departments
                                </div>
                            ) : (
                                <Timeline active={employee.departments.length - 1} bulletSize={24} lineWidth={2}>
                                    {employee.departments.map((department, index) => (
                                        <Timeline.Item
                                            key={`${department.departmentId}-${index}`}
                                            title={
                                                <Link href={`/departments/${department.departmentId}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                                    {department.name}
                                                </Link>
                                            }
                                        >
                                            <div className="bg-gray-50 p-4 rounded-md mt-2">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <div>
                                                        <Text size="sm" c="dimmed">Transfer Period</Text>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            <Badge color={!department.transferOutDate ? "green" : "blue"} variant="light">
                                                                {formatDate(department.transferInDate)} - {formatDate(department.transferOutDate)}
                                                            </Badge>
                                                            {!department.transferOutDate && (
                                                                <Badge color="green">Current</Badge>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <Text size="sm" c="dimmed">Position</Text>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {department.position}
                                                        </div>
                                                    </div>

                                                    {department.appointmentDate && (
                                                        <div>
                                                            <Text size="sm" c="dimmed">Appointment Date</Text>
                                                            <div className="mt-1">
                                                                <Badge color="purple" variant="light">
                                                                    {formatDate(department.appointmentDate)}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </Timeline.Item>
                                    ))}
                                </Timeline>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}