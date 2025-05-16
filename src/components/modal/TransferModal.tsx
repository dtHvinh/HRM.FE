'use client';

import { fetcher, put } from '@/util/api';
import { notifyError } from '@/util/toast-util';
import { Button, Modal, Select, Text } from '@mantine/core';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    employeeId: number;
    employeeName: string;
    currentDepartment: string;
    currentPosition: string;
}

export default function TransferModal({
    isOpen,
    onClose,
    employeeId,
    employeeName,
    currentDepartment,
    currentPosition
}: TransferModalProps) {
    const [departmentId, setDepartmentId] = useState<string | null>(null);
    const [positionId, setPositionId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch departments and positions
    const { data: departments } = useSWR<{ departmentId: number; name: string }[]>('/api/departments', fetcher);
    const { data: positions } = useSWR<{ positionId: number; name: string }[]>('/api/positions', fetcher);

    // Transform data for select components
    const departmentOptions = departments?.map(d => ({ value: d.departmentId.toString(), label: d.name })) || [];
    const positionOptions = positions?.map(p => ({ value: p.positionId.toString(), label: p.name })) || [];

    const handleTransfer = async () => {
        if (!departmentId || !positionId) {
            notifyError('Please select both department and position');
            return;
        }

        setIsSubmitting(true);
        try {
            await put(`/api/employees/${employeeId}/transfer`, JSON.stringify({
                departmentId,
                positionId
            }));

            // Refresh the employees list
            await mutate('/api/employees');
            onClose();
        } catch (error) {
            notifyError('Failed to transfer employee');
            console.error('Transfer error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Modal opened={isOpen} onClose={onClose} title="Transfer Employee" centered>
            <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-md">
                    <Text size="xs" color="dimmed">Full Name</Text>
                    <Text size="sm" className="text-blue-800">
                        {employeeName}
                    </Text>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                        <div>
                            <Text size="xs" color="dimmed">Current Department</Text>
                            <Text size="sm">{currentDepartment}</Text>
                        </div>
                        <div>
                            <Text size="xs" color="dimmed">Current Position</Text>
                            <Text size="sm">{currentPosition}</Text>
                        </div>
                    </div>
                </div>

                <Select
                    label="New Department"
                    placeholder="Select department"
                    data={departmentOptions}
                    value={departmentId}
                    onChange={setDepartmentId}
                    searchable
                    required
                />

                <Select
                    label="New Position"
                    placeholder="Select position"
                    data={positionOptions}
                    value={positionId}
                    onChange={setPositionId}
                    searchable
                    required
                />

                <div className="flex justify-end gap-3 mt-4">
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleTransfer}
                        loading={isSubmitting}
                        disabled={!departmentId || !positionId}
                    >
                        Transfer
                    </Button>
                </div>
            </div>
        </Modal>
    );
}