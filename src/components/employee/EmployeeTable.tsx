"use client";

import { GetEmployeeDTO } from "@/app/page";
import EmployeeTableRow from "./EmployeeTableRow";

interface EmployeeTableProps {
  employees: GetEmployeeDTO[] | undefined;
  editingEmployeeId: number | null;
  editForm: {
    fullName: string;
    email: string;
    phone: string;
    dob: string;
    gender: string;
    provinceId: string;
    wardId: string;
  };
  provinceOptions: { value: string; label: string }[];
  wardOptions: { value: string; label: string }[];
  onStartEditing: (employee: GetEmployeeDTO) => void;
  onSaveEdit: (employeeId: number) => void;
  onCancelEdit: () => void;
  onTransfer: (employee: GetEmployeeDTO) => void;
  onPrint: (employeeId: number) => void;
  onFormChange: (field: string, value: string) => void;
}

export default function EmployeeTable({
  employees,
  editingEmployeeId,
  editForm,
  provinceOptions,
  wardOptions,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onTransfer,
  onPrint,
  onFormChange,
}: EmployeeTableProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Họ Tên
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Ngày Sinh
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Giới Tính
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Tỉnh/Thành Phố
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Quận/Huyện
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Email
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Điện Thoại
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Phòng Ban
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Chức Vụ
              </th>
              <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">
                Thao Tác
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees?.map((employee) => (
              <EmployeeTableRow
                key={employee.employeeId}
                employee={employee}
                editingEmployeeId={editingEmployeeId}
                editForm={editForm}
                provinceOptions={provinceOptions}
                wardOptions={wardOptions}
                onStartEditing={onStartEditing}
                onSaveEdit={onSaveEdit}
                onCancelEdit={onCancelEdit}
                onTransfer={onTransfer}
                onPrint={onPrint}
                onFormChange={onFormChange}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
