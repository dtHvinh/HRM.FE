'use client'

import { fetcher, post, put } from '@/util/api';
import { notifyError, notifySuccess } from '@/util/toast-util';
import { Button, NumberInput, Select, Table, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

interface SalaryDTO {
    salaryId: number;
    employeeId: number;
    amount: number;
    effectiveDate: string;
    endDate: string | null;
    type: string;
    note: string;
}

interface SalaryManagementProps {
    employeeId: string;
}

export default function SalaryManagement({ employeeId }: SalaryManagementProps) {
    const { data: salaries, error, isLoading } = useSWR<SalaryDTO[]>(
        `/api/employees/${employeeId}/salaries`,
        fetcher
    );

    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newSalary, setNewSalary] = useState({
        amount: 0,
        effectiveDate: new Date().toISOString(),
        type: 'Lương cơ bản',
        note: '',
    });

    const handleAddSalary = async () => {
        if (newSalary.amount <= 0) {
            notifyError('Số tiền lương phải lớn hơn 0');
            return;
        }

        setIsSubmitting(true);
        try {
            await post(`/api/employees/${employeeId}/salaries`, JSON.stringify({
                ...newSalary,
                employeeId: parseInt(employeeId),
            }));

            // Reset form and refresh data
            setNewSalary({
                amount: 0,
                effectiveDate: new Date().toISOString(),
                type: 'Lương cơ bản',
                note: '',
            });
            setIsAdding(false);
            await mutate(`/api/employees/${employeeId}/salaries`);
            notifySuccess('Thêm thông tin lương thành công');
        } catch (error) {
            notifyError('Không thể thêm thông tin lương');
            console.error('Lỗi khi thêm lương:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEndSalary = async (salaryId: number) => {
        if (!confirm('Bạn có chắc chắn muốn kết thúc mức lương này?')) {
            return;
        }

        try {
            await put(`/api/employees/${employeeId}/salaries/${salaryId}/end`, JSON.stringify({
                endDate: new Date().toISOString(),
            }));

            await mutate(`/api/employees/${employeeId}/salaries`);
            notifySuccess('Kết thúc mức lương thành công');
        } catch (error) {
            notifyError('Không thể kết thúc mức lương');
            console.error('Lỗi khi kết thúc lương:', error);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    const formatDate = (dateString: string | null) => {
        if (!dateString) return 'Hiện tại';
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    if (isLoading) {
        return <div className="p-4 text-center">Đang tải...</div>;
    }

    if (error) {
        return <div className="p-4 text-center text-red-500">Không thể tải thông tin lương</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Quản Lý Lương</h3>
                {!isAdding && (
                    <Button size="sm" onClick={() => setIsAdding(true)}>
                        Thêm Mức Lương Mới
                    </Button>
                )}
            </div>

            {isAdding && (
                <div className="bg-gray-50 p-4 rounded-md mb-4">
                    <h4 className="text-md font-medium mb-3">Thêm Mức Lương Mới</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <NumberInput
                            label="Số Tiền"
                            value={newSalary.amount}
                            onChange={(value) => setNewSalary({ ...newSalary, amount: value as number })}
                            required
                            min={0}
                            step={100000}
                            thousandSeparator=","
                        />
                        <DateInput
                            label="Ngày Hiệu Lực"
                            value={newSalary.effectiveDate ? new Date(newSalary.effectiveDate) : null}
                            onChange={(date) => setNewSalary({ ...newSalary, effectiveDate: date ? date.toString() : new Date().toISOString() })}
                            required
                        />
                        <Select
                            label="Loại Lương"
                            data={[
                                { value: 'Lương cơ bản', label: 'Lương cơ bản' },
                                { value: 'Lương thưởng', label: 'Lương thưởng' },
                                { value: 'Phụ cấp', label: 'Phụ cấp' },
                            ]}
                            value={newSalary.type}
                            onChange={(value) => setNewSalary({ ...newSalary, type: value || 'Lương cơ bản' })}
                            required
                        />
                        <TextInput
                            label="Ghi Chú"
                            value={newSalary.note}
                            onChange={(e) => setNewSalary({ ...newSalary, note: e.target.value })}
                            placeholder="Thêm ghi chú (không bắt buộc)"
                        />
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsAdding(false)} disabled={isSubmitting}>
                            Hủy
                        </Button>
                        <Button onClick={handleAddSalary} loading={isSubmitting}>
                            Lưu
                        </Button>
                    </div>
                </div>
            )}

            {salaries && salaries.length > 0 ? (
                <Table>
                    <Table.Thead>
                        <Table.Tr>
                            <Table.Th>Số Tiền</Table.Th>
                            <Table.Th>Loại</Table.Th>
                            <Table.Th>Ngày Hiệu Lực</Table.Th>
                            <Table.Th>Ngày Kết Thúc</Table.Th>
                            <Table.Th>Ghi Chú</Table.Th>
                            <Table.Th>Thao Tác</Table.Th>
                        </Table.Tr>
                    </Table.Thead>
                    <Table.Tbody>
                        {salaries.map((salary) => (
                            <Table.Tr key={salary.salaryId}>
                                <Table.Td>{formatCurrency(salary.amount)}</Table.Td>
                                <Table.Td>{salary.type}</Table.Td>
                                <Table.Td>{formatDate(salary.effectiveDate)}</Table.Td>
                                <Table.Td>{formatDate(salary.endDate)}</Table.Td>
                                <Table.Td>{salary.note}</Table.Td>
                                <Table.Td>
                                    {!salary.endDate && (
                                        <Button
                                            size="xs"
                                            variant="outline"
                                            color="red"
                                            onClick={() => handleEndSalary(salary.salaryId)}
                                        >
                                            Kết Thúc
                                        </Button>
                                    )}
                                </Table.Td>
                            </Table.Tr>
                        ))}
                    </Table.Tbody>
                </Table>
            ) : (
                <div className="text-center py-6 bg-gray-50 rounded-md">
                    <p className="text-gray-500">Chưa có thông tin lương</p>
                    {!isAdding && (
                        <Button size="xs" variant="outline" onClick={() => setIsAdding(true)} className="mt-2">
                            Thêm Mức Lương
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}