'use client'

import MainLayout from '@/components/layout/MainLayout';
import { post } from '@/util/api';
import { countryCallingCodes } from '@/util/dataset';
import { notifyError, notifySuccess } from '@/util/toast-util';
import { Autocomplete, Button, Select, TextInput } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import useSWR from 'swr';

export default function AddEmployeePage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        phone: '',
        dob: '',
        gender: '',
        provinceId: '',
        wardId: '',
        departmentId: '',
        positionId: '',
    });

    // Fetch data for dropdowns
    const { data: provinces } = useSWR('/api/provinces');
    const { data: wards } = useSWR('/api/wards');
    const { data: departments } = useSWR('/api/departments');
    const { data: positions } = useSWR('/api/positions');

    // Transform data for select components
    const provinceOptions = provinces?.map((p: any) => ({ value: p.provinceId.toString(), label: p.provinceName })) || [];
    const wardOptions = wards?.map((w: any) => ({ value: w.wardId.toString(), label: w.wardName })) || [];
    const departmentOptions = departments?.map((d: any) => ({ value: d.departmentId.toString(), label: d.name })) || [];
    const positionOptions = positions?.map((p: any) => ({ value: p.positionId.toString(), label: p.name })) || [];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate form
        if (!form.fullName || !form.email || !form.phone || !form.dob || !form.gender ||
            !form.provinceId || !form.wardId || !form.departmentId || !form.positionId) {
            notifyError('Vui lòng điền đầy đủ thông tin');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await post('/api/employees', JSON.stringify(form));
            notifySuccess('Thêm nhân viên thành công');
            router.push('/');
        } catch (error) {
            console.error('Lỗi khi thêm nhân viên:', error);
            notifyError('Không thể thêm nhân viên. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout activePath="/">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Thêm Nhân Viên Mới</h1>
                <p className="text-gray-700">Điền thông tin để thêm nhân viên mới</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <TextInput
                            label="Họ và Tên"
                            placeholder="Nhập họ và tên đầy đủ"
                            value={form.fullName}
                            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                            required
                        />

                        <DateInput
                            label="Ngày Sinh"
                            placeholder="Chọn ngày sinh"
                            value={form.dob ? new Date(form.dob) : null}
                            onChange={(date) => setForm({ ...form, dob: date ? date.toString() : '' })}
                            required
                        />

                        <Select
                            label="Giới Tính"
                            placeholder="Chọn giới tính"
                            data={[
                                { value: 'Nam', label: 'Nam' },
                                { value: 'Nữ', label: 'Nữ' },
                            ]}
                            value={form.gender}
                            onChange={(value) => setForm({ ...form, gender: value || '' })}
                            required
                        />

                        <TextInput
                            label="Email"
                            placeholder="Nhập địa chỉ email"
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />

                        <Autocomplete
                            label="Số Điện Thoại"
                            placeholder="Nhập số điện thoại"
                            data={countryCallingCodes}
                            value={form.phone}
                            onChange={(value) => setForm({ ...form, phone: value })}
                            required
                        />

                        <Select
                            label="Tỉnh/Thành Phố"
                            placeholder="Chọn tỉnh/thành phố"
                            data={provinceOptions}
                            value={form.provinceId}
                            onChange={(value) => setForm({ ...form, provinceId: value || '' })}
                            searchable
                            required
                        />

                        <Select
                            label="Quận/Huyện"
                            placeholder="Chọn quận/huyện"
                            data={wardOptions}
                            value={form.wardId}
                            onChange={(value) => setForm({ ...form, wardId: value || '' })}
                            searchable
                            required
                        />

                        <Select
                            label="Phòng Ban"
                            placeholder="Chọn phòng ban"
                            data={departmentOptions}
                            value={form.departmentId}
                            onChange={(value) => setForm({ ...form, departmentId: value || '' })}
                            searchable
                            required
                        />

                        <Select
                            label="Chức Vụ"
                            placeholder="Chọn chức vụ"
                            data={positionOptions}
                            value={form.positionId}
                            onChange={(value) => setForm({ ...form, positionId: value || '' })}
                            searchable
                            required
                        />
                    </div>

                    <div className="flex justify-end gap-4">
                        <Button
                            variant="outline"
                            onClick={() => router.push('/')}
                            disabled={isSubmitting}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            loading={isSubmitting}
                        >
                            Thêm Nhân Viên
                        </Button>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}