'use client'

import ActionButton from '@/components/button/ActionButton';
import { fetcher, post } from '@/util/api';
import { notifyError, notifySuccess } from '@/util/toast-util';
import { Badge, NumberInput, Text, Timeline } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useState } from 'react';
import useSWR from 'swr';

interface SalaryManagementProps {
    employeeId: string;
}

interface EmployeeSalary {
    salaryId: number;
    salaryCoefficient: number;
    paymentDate: string;
}

const defaultAddSalaryForm = {
    salaryCoefficient: '',
    paymentDate: ''
}

export default function SalaryManagement({ employeeId }: SalaryManagementProps) {
    // Salary management state
    const [isAddingSalary, setIsAddingSalary] = useState(false);
    const { data: employeeSalaries, error: salaryError, mutate: salaryMutate } = useSWR<EmployeeSalary[]>(
        `/api/salaries/${employeeId}`,
        fetcher
    );
    const [addSalaryForm, setAddSalaryForm] = useState<{
        salaryCoefficient: string | number,
        paymentDate: string
    }>(defaultAddSalaryForm);

    const handleAddSalary = async () => {
        try {
            await post(`/api/salaries/${employeeId}`, JSON.stringify(addSalaryForm));
            salaryMutate();
            notifySuccess('Successfully added salary');
        }
        catch (error) {
            notifyError('Error adding salary');
        }
        setIsAddingSalary(false);
        setAddSalaryForm(defaultAddSalaryForm);
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
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Salary Management</h3>
                <div className='space-x-5'>
                    <ActionButton
                        kind="add"
                        onClick={() => setIsAddingSalary(true)}
                    />
                </div>
            </div>

            {isAddingSalary && (
                <div className='flex flex-row gap-5 items-center bg-blue-50 ps-5 pe-8 py-5 rounded-xl mb-6'>
                    <DateInput
                        label="Payment Date"
                        placeholder="Select date"
                        onChange={(value) => setAddSalaryForm({ ...addSalaryForm, paymentDate: value || '' })}
                        required
                    />

                    <NumberInput
                        label="Salary Coefficient"
                        onChange={(value) => setAddSalaryForm({ ...addSalaryForm, salaryCoefficient: value })}
                        placeholder="Enter salary coefficient"
                        required
                    />

                    <ActionButton className='mt-2 ml-auto' kind='cancel' onClick={() => setIsAddingSalary(false)} />
                    <ActionButton className='mt-2' kind='check' onClick={handleAddSalary} />
                </div>
            )}

            {(!employeeSalaries || employeeSalaries.length === 0) ? (
                <div className="text-center py-4 text-gray-500">
                    No salary records available
                </div>
            ) : (
                <div className="space-y-6">
                    <Text size="sm" c="dimmed" className="mb-2">Salary History</Text>

                    <Timeline active={employeeSalaries.length - 1} bulletSize={24} variant='' lineWidth={2} >
                        {employeeSalaries.map((salary, index) => (
                            <Timeline.Item
                                key={salary.salaryId}
                                title={<Text fw={500}>{salary.paymentDate}</Text>}
                            >
                                <div className="bg-gray-50 rounded-md mt-2">
                                    <Text size="sm" c="dimmed" className="mb-1">Salary Coefficient</Text>
                                    <div className="flex items-center gap-5">
                                        <>
                                            <Badge size="lg" color="blue" variant="light">
                                                {salary.salaryCoefficient.toFixed(2)}
                                            </Badge>
                                            <div className="flex-grow"></div>
                                        </>
                                    </div>
                                </div>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </div>
            )}
        </div>
    );
}