"use client";

import ActionButton from "@/components/button/ActionButton";

interface EmployeePageHeaderProps {
  onSearch: () => void;
  onPrintAll: () => void;
  onAdd: () => void;
}

export default function EmployeePageHeader({
  onSearch,
  onPrintAll,
  onAdd,
}: EmployeePageHeaderProps) {
  return (
    <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">Nhân Viên</h1>
        <p className="text-gray-700">Quản lý nhân viên của bạn</p>
      </div>
      <div className="flex gap-5">
        <div className="flex items-center gap-2">
          <ActionButton kind="search" onClick={onSearch} />
          <ActionButton kind="print" onClick={onPrintAll} />
        </div>
        <ActionButton kind="add" onClick={onAdd} />
      </div>
    </div>
  );
}
