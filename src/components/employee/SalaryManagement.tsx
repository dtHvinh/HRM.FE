'use client'

import { del, fetcher, post } from '@/util/api';
import { notifyError, notifySuccess } from '@/util/toast-util';
import { Button, Modal, NumberInput, Select, Table, Tabs } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import ActionButton from '../button/ActionButton';

interface GetSalaryDTO {
    salaryId: number;
    salaryCoefficient: number;
    paymentDate: string;
}

interface GetEmployeeBenefitDTO {
    employeeId: number;
    employeeName: string;
    allowanceId: number;
    allowanceName: string;
    allowanceCoefficient: number;
    insuranceId: number;
    insuranceName: string;
    insuranceCoefficient: number;
    joinedDate: string;
}

interface Allowance {
    allowanceId: number;
    allowanceName: string;
    allowanceCoefficient: number;
}

interface Insurance {
    insuranceId: number;
    insuranceName: string;
    insuranceCoefficient: number;
}

interface SalaryManagementProps {
    employeeId: string;
}

export default function SalaryManagement({ employeeId }: SalaryManagementProps) {
    const { data: salaries, error: salaryError, isLoading: salaryLoading } = useSWR<GetSalaryDTO[]>(
        `/api/salaries/${employeeId}/`,
        fetcher
    );

    const { data: benefits, error: benefitError, isLoading: benefitLoading } = useSWR<GetEmployeeBenefitDTO[]>(
        `/api/benefits/employee/${employeeId}`,
        fetcher
    );

    const { data: allowances } = useSWR<Allowance[]>('/api/allowances', fetcher);
    const { data: insurances } = useSWR<Insurance[]>('/api/insurances', fetcher);

    const [isAdding, setIsAdding] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [newSalary, setNewSalary] = useState({
        salaryCoefficient: 0,
        paymentDate: new Date().toISOString(),
    });

    // Benefit modal state
    const [opened, { open, close }] = useDisclosure(false);
    const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
    const [selectedBenefit, setSelectedBenefit] = useState<GetEmployeeBenefitDTO | null>(null);
    const [newBenefit, setNewBenefit] = useState({
        allowanceId: '',
        insuranceId: ''
    });

    const handleAddSalary = async () => {
        if (newSalary.salaryCoefficient <= 0) {
            notifyError('Số tiền lương phải lớn hơn 0');
            return;
        }

        setIsSubmitting(true);
        try {
            await post(`/api/salaries/${employeeId}/`, JSON.stringify({
                ...newSalary,
                employeeId: parseInt(employeeId),
            }));

            // Reset form and refresh data
            setNewSalary({
                salaryCoefficient: 0,
                paymentDate: new Date().toISOString(),
            });
            setIsAdding(false);
            await mutate(`/api/salaries/${employeeId}/`);
            notifySuccess('Thêm thông tin lương thành công');
        } catch (error) {
            notifyError('Không thể thêm thông tin lương');
            console.error('Lỗi khi thêm lương:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddBenefit = async () => {
        if (!newBenefit.allowanceId || !newBenefit.insuranceId) {
            notifyError('Vui lòng chọn đầy đủ thông tin phụ cấp và bảo hiểm');
            return;
        }

        setIsSubmitting(true);

        try {
            await post(`/api/benefits/${employeeId}`, JSON.stringify({
                allowanceId: parseInt(newBenefit.allowanceId),
                insuranceId: parseInt(newBenefit.insuranceId)
            }));

            // Reset form and refresh data
            setNewBenefit({
                allowanceId: '',
                insuranceId: ''
            });
            close();
            await mutate(`/api/employee-benefits/employee/${employeeId}`);
            notifySuccess('Thêm phúc lợi thành công');
        } catch (error) {
            notifyError('Không thể thêm phúc lợi');
            console.error('Lỗi khi thêm phúc lợi:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteBenefit = async () => {
        if (!selectedBenefit) return;

        setIsSubmitting(true);
        try {
            await del(`/api/benefits/${selectedBenefit.employeeId}/${selectedBenefit.allowanceId}/${selectedBenefit.insuranceId}`);
            closeDeleteModal();
            await mutate(`/api/benefits/employee/${employeeId}`);
            notifySuccess('Xóa phúc lợi thành công');
        } catch (error) {
            notifyError('Không thể xóa phúc lợi');
            console.error('Lỗi khi xóa phúc lợi:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    if (salaryLoading || benefitLoading) {
        return <div className="p-4 text-center">Đang tải...</div>;
    }

    if (salaryError && benefitError) {
        return <div className="p-4 text-center text-red-500">Không thể tải thông tin</div>;
    }

    return (
        <div>
            <Tabs defaultValue="salary">
                <Tabs.List>
                    <Tabs.Tab value="salary">Quản Lý Lương</Tabs.Tab>
                    <Tabs.Tab value="benefits">Phúc Lợi</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="salary" pt="md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Quản Lý Lương</h3>
                        {!isAdding && (
                            <ActionButton kind='add' onClick={() => setIsAdding(true)}>
                            </ActionButton>
                        )}
                    </div>

                    {isAdding && (
                        <div className="bg-gray-50 p-4 rounded-md mb-4">
                            <h4 className="text-md font-medium mb-3">Thêm Mức Lương Mới</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <NumberInput
                                    label="Hệ Số Lương"
                                    value={newSalary.salaryCoefficient}
                                    onChange={(value) => setNewSalary({ ...newSalary, salaryCoefficient: value as number })}
                                    required
                                    min={0}
                                    step={0.1}
                                    thousandSeparator=","
                                />
                                <DateInput
                                    label="Ngày Hiệu Lực"
                                    value={newSalary.paymentDate ? new Date(newSalary.paymentDate) : null}
                                    onChange={(date) => setNewSalary({ ...newSalary, paymentDate: date ? date.toString() : new Date().toISOString() })}
                                    required
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
                        <div className="space-y-4">
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Hệ Số Lương</Table.Th>
                                        <Table.Th>Ngày Hiệu Lực</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {salaries.map((salary) => (
                                        <Table.Tr key={salary.salaryId}>
                                            <Table.Td>{salary.salaryCoefficient}</Table.Td>
                                            <Table.Td>{salary.paymentDate}</Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </div>
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
                </Tabs.Panel>

                <Tabs.Panel value="benefits" pt="md">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Phúc Lợi Nhân Viên</h3>
                        <ActionButton kind='add' onClick={open} />
                    </div>

                    {benefits && benefits.length > 0 ? (
                        <div className="space-y-4">
                            <Table>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Table.Th>Loại Phụ Cấp</Table.Th>
                                        <Table.Th>Hệ Số Phụ Cấp</Table.Th>
                                        <Table.Th>Loại Bảo Hiểm</Table.Th>
                                        <Table.Th>Hệ Số Bảo Hiểm</Table.Th>
                                        <Table.Th>Ngày Tham Gia</Table.Th>
                                        <Table.Th>Thao Tác</Table.Th>
                                    </Table.Tr>
                                </Table.Thead>
                                <Table.Tbody>
                                    {benefits.map((benefit, index) => (
                                        <Table.Tr key={index}>
                                            <Table.Td>{benefit.allowanceName}</Table.Td>
                                            <Table.Td>{benefit.allowanceCoefficient}</Table.Td>
                                            <Table.Td>{benefit.insuranceName}</Table.Td>
                                            <Table.Td>{benefit.insuranceCoefficient}</Table.Td>
                                            <Table.Td>{formatDate(benefit.joinedDate)}</Table.Td>
                                            <Table.Td>
                                                <ActionButton
                                                    kind='delete'
                                                    onClick={() => {
                                                        setSelectedBenefit(benefit);
                                                        openDeleteModal();
                                                    }}
                                                />
                                            </Table.Td>
                                        </Table.Tr>
                                    ))}
                                </Table.Tbody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-6 bg-gray-50 rounded-md">
                            <p className="text-gray-500">Chưa có thông tin phúc lợi</p>
                            <Button size="xs" variant="outline" onClick={open} className="mt-2">
                                Thêm Phúc Lợi
                            </Button>
                        </div>
                    )}

                    {/* Add Benefit Modal */}
                    <Modal opened={opened} onClose={close} title="Thêm Phúc Lợi Mới" centered>
                        <div className="space-y-4">
                            <Select
                                label="Loại Phụ Cấp"
                                placeholder="Chọn loại phụ cấp"
                                data={allowances?.map(a => ({ value: a.allowanceId.toString(), label: a.allowanceName })) || []}
                                value={newBenefit.allowanceId}
                                onChange={(value) => setNewBenefit({ ...newBenefit, allowanceId: value || '' })}
                                searchable
                                required
                            />

                            <Select
                                label="Loại Bảo Hiểm"
                                placeholder="Chọn loại bảo hiểm"
                                data={insurances?.map(i => ({ value: i.insuranceId.toString(), label: i.insuranceName })) || []}
                                value={newBenefit.insuranceId}
                                onChange={(value) => setNewBenefit({ ...newBenefit, insuranceId: value || '' })}
                                searchable
                                required
                            />

                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={close} disabled={isSubmitting}>
                                    Hủy
                                </Button>
                                <Button onClick={handleAddBenefit} loading={isSubmitting}>
                                    Lưu
                                </Button>
                            </div>
                        </div>
                    </Modal>

                    {/* Delete Confirmation Modal */}
                    <Modal opened={deleteModalOpened} onClose={closeDeleteModal} title="Xác Nhận Xóa" centered>
                        <div className="space-y-4">
                            <p>Bạn có chắc chắn muốn xóa phúc lợi này?</p>
                            {selectedBenefit && (
                                <div className="bg-gray-50 p-3 rounded-md">
                                    <p><strong>Phụ cấp:</strong> {selectedBenefit.allowanceName}</p>
                                    <p><strong>Bảo hiểm:</strong> {selectedBenefit.insuranceName}</p>
                                </div>
                            )}

                            <div className="flex justify-end gap-2 mt-4">
                                <Button variant="outline" onClick={closeDeleteModal} disabled={isSubmitting}>
                                    Hủy
                                </Button>
                                <Button color="red" onClick={handleDeleteBenefit} loading={isSubmitting}>
                                    Xóa
                                </Button>
                            </div>
                        </div>
                    </Modal>
                </Tabs.Panel>
            </Tabs>
        </div>
    );
}