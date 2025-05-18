'use client'

import ActionButton from '@/components/button/ActionButton';
import { fetcher, post } from '@/util/api';
import { notifyError, notifySuccess } from '@/util/toast-util';
import { Badge, NumberInput, Select, Table, Tabs, Text, Timeline } from '@mantine/core';
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

interface EmployeeBenefit {
    employeeId: number;
    insuranceId: number;
    insuranceName: string;
    insuranceCoefficient: number;
    allowanceId: number;
    allowanceName: string;
    allowanceCoefficient: number;
}

interface Insurance {
    insuranceId: number;
    insuranceName: string;
    insuranceCoefficient: number;
}

interface Allowance {
    allowanceId: number;
    allowanceName: string;
    allowanceCoefficient: number;
}

const defaultAddSalaryForm = {
    salaryCoefficient: '',
    paymentDate: ''
}

const defaultAddBenefitForm = {
    insuranceId: '',
    allowanceId: '',
}

export default function SalaryManagement({ employeeId }: SalaryManagementProps) {
    // Tab state
    const [activeTab, setActiveTab] = useState<string | null>('salary');

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

    // Benefit management state
    const [isAddingBenefit, setIsAddingBenefit] = useState(false);
    const { data: employeeBenefits, error: benefitError, mutate: benefitMutate } = useSWR<EmployeeBenefit[]>(
        `/api/benefits/employee/${employeeId}`,
        fetcher
    );
    console.log(employeeBenefits);
    // Fetch insurance and allowance data
    const { data: insurances } = useSWR<Insurance[]>('/api/insurances', fetcher);
    const { data: allowances } = useSWR<Allowance[]>('/api/allowances', fetcher);

    const [addBenefitForm, setAddBenefitForm] = useState<{
        insuranceId: string | number,
        allowanceId: string | number,
    }>(defaultAddBenefitForm);

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

    const handleAddBenefit = async () => {
        try {
            await post(`/api/benefits/${employeeId}`, JSON.stringify(addBenefitForm));
            benefitMutate();
            notifySuccess('Successfully added benefit');
        }
        catch (error) {
            notifyError('Error adding benefit');
        }
        setIsAddingBenefit(false);
        setAddBenefitForm(defaultAddBenefitForm);
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
            <Tabs value={activeTab} onChange={setActiveTab} className="mb-4">
                <Tabs.List>
                    <Tabs.Tab value="salary">Salary</Tabs.Tab>
                    <Tabs.Tab value="benefits">Benefits</Tabs.Tab>
                </Tabs.List>
            </Tabs>

            {activeTab === 'salary' && (
                <>
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
                </>
            )}

            {activeTab === 'benefits' && (
                <>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Benefit Management</h3>
                        <div className='space-x-5'>
                            {benefitError &&
                                <ActionButton
                                    kind="add"
                                    onClick={() => setIsAddingBenefit(true)}
                                />
                            }
                        </div>
                    </div>

                    {isAddingBenefit && (
                        <div className='flex flex-col gap-5 bg-blue-50 ps-5 pe-8 py-5 rounded-xl mb-6'>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    label="Insurance"
                                    placeholder="Select insurance"
                                    data={insurances?.map(insurance => ({
                                        value: insurance.insuranceId.toString(),
                                        label: `${insurance.insuranceName} (${insurance.insuranceCoefficient.toFixed(2)})`
                                    })) || []}
                                    onChange={(value) => {
                                        const selectedInsurance = insurances?.find(i => i.insuranceId.toString() === value);
                                        setAddBenefitForm({
                                            ...addBenefitForm,
                                            insuranceId: value || '',
                                        });
                                    }}
                                    searchable
                                    required
                                />

                                <Select
                                    label="Allowance"
                                    placeholder="Select allowance"
                                    data={allowances?.map(allowance => ({
                                        value: allowance.allowanceId.toString(),
                                        label: `${allowance.allowanceName} (${allowance.allowanceCoefficient.toFixed(2)})`
                                    })) || []}
                                    onChange={(value) => {
                                        setAddBenefitForm({
                                            ...addBenefitForm,
                                            allowanceId: value || '',
                                        });
                                    }}
                                    searchable
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2 mt-2">
                                <ActionButton kind='cancel' onClick={() => setIsAddingBenefit(false)} />
                                <ActionButton kind='check' onClick={handleAddBenefit} />
                            </div>
                        </div>
                    )}

                    {(!employeeBenefits || employeeBenefits.length === 0) ? (
                        <div className="text-center py-4 text-gray-500">
                            No benefit records available
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <Text size="sm" c="dimmed" className="mb-2">Benefit Records</Text>

                            <Table striped highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Insurance Name</Table.Th>
                                        <Table.Th>Insurance Coefficient</Table.Th>
                                        <Table.Th>Allowance Name</Table.Th>
                                        <Table.Th>Allowance Coefficient</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {employeeBenefits.map((benefit) => (
                                        <Table.Tr key={benefit.employeeId}>
                                            <Table.Td>{benefit.insuranceName}</Table.Td>
                                            <Table.Td>
                                                <Badge size="sm" color="blue" variant="light">
                                                    {benefit.insuranceCoefficient.toFixed(2)}
                                                </Badge>
                                            </Table.Td>
                                            <Table.Td>{benefit.allowanceName}</Table.Td>
                                            <Table.Td>
                                                <Badge size="sm" color="green" variant="light">
                                                    {benefit.allowanceCoefficient.toFixed(2)}
                                                </Badge>
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}