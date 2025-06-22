"use client";

import { Select } from "@mantine/core";

interface EmployeeFiltersProps {
  provinceOptions: { value: string; label: string }[];
  wardOptions: { value: string; label: string }[];
  departmentOptions: { value: string; label: string }[];
  onProvinceChange: (value: string | null) => void;
  onWardChange: (value: string | null) => void;
  onDepartmentChange: (value: string | null) => void;
  onGenderChange: (value: string | null) => void;
}

export default function EmployeeFilters({
  provinceOptions,
  wardOptions,
  departmentOptions,
  onProvinceChange,
  onWardChange,
  onDepartmentChange,
  onGenderChange,
}: EmployeeFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Select
            label="Tỉnh/Thành Phố"
            placeholder="Chọn tỉnh/thành phố"
            description="Chọn tỉnh/thành phố"
            data={provinceOptions}
            onChange={onProvinceChange}
            required
            searchable
            clearable
          />
        </div>
        <div>
          <Select
            label="Quận/Huyện"
            description="Chọn quận/huyện"
            placeholder="Chọn quận/huyện"
            data={wardOptions}
            onChange={onWardChange}
            required
            clearable
            searchable
          />
        </div>
        <div>
          <Select
            label="Phòng Ban"
            placeholder="Chọn phòng ban"
            description="Chọn phòng ban"
            data={departmentOptions}
            clearable
            onChange={onDepartmentChange}
            searchable
            required
          />
        </div>
        <div>
          <Select
            label="Giới Tính"
            placeholder="Chọn giới tính"
            description="Chọn giới tính"
            data={[
              { value: "1", label: "Nam" },
              { value: "2", label: "Nữ" },
            ]}
            clearable
            onChange={onGenderChange}
            searchable
            required
          />
        </div>
      </div>
    </div>
  );
}
