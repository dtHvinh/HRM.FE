'use client'

import { Modal, TextInput } from '@mantine/core';

interface SearchModalProps {
    isOpen: boolean;
    onClose: () => void;
    value: string;
    onChange: (value: string) => void;
}

export default function SearchModal({ isOpen, onClose, value, onChange }: SearchModalProps) {
    return (
        <Modal
            opened={isOpen}
            onClose={onClose}
            title="Tìm kiếm nhân sự"
            centered
            size="sm"
        >
            <TextInput
                label="Tìm kiếm"
                placeholder="Nhập tên"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                autoFocus
            />
        </Modal>
    );
}