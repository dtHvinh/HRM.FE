"use client";

import { GetEmployeeDTO } from "@/app/page";
import ActionButton from "@/components/button/ActionButton";
import { countryCallingCodes } from "@/util/dataset";
import { Autocomplete, Select, TextInput, Tooltip } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { RefreshCw } from "lucide-react";
import Link from "next/link";

interface EmployeeTableRowProps {
  employee: GetEmployeeDTO;
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

export default function EmployeeTableRow({
  employee,
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
}: EmployeeTableRowProps) {
  const isEditing = editingEmployeeId === employee.employeeId;

  return (
    <tr key={employee.employeeId} className="hover:bg-gray-50">
      <td className="py-4 px-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
            {employee.fullName
              .split(" ")
              .map((name) => name[0])
              .join("")}
          </div>
          <div>
            {isEditing ? (
              <TextInput
                description={employee.fullName}
                value={editForm.fullName}
                onChange={(e) => onFormChange("fullName", e.target.value)}
                size="xs"
              />
            ) : (
              <Link
                href={`/employees/${employee.employeeId}`}
                className="text-sm font-medium text-gray-900 hover:text-blue-600"
              >
                {employee.fullName}
              </Link>
            )}
          </div>
        </div>
      </td>

      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
        {isEditing ? (
          <DateInput
            description={new Date(employee.dob).toLocaleDateString()}
            value={editForm.dob ? new Date(editForm.dob) : null}
            onChange={(date) =>
              onFormChange("dob", date ? date.toString() : "")
            }
            size="xs"
            valueFormat="DD/MM/YYYY"
          />
        ) : (
          new Date(employee.dob).toLocaleDateString()
        )}
      </td>

      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
        {isEditing ? (
          <Select
            description={employee.gender}
            value={editForm.gender}
            onChange={(value) => onFormChange("gender", value || "")}
            data={[
              { value: "Nam", label: "Nam" },
              { value: "Nữ", label: "Nữ" },
            ]}
            size="xs"
          />
        ) : employee.gender === "Male" ? (
          "Nam"
        ) : employee.gender === "Female" ? (
          "Nữ"
        ) : (
          employee.gender
        )}
      </td>

      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
        {isEditing ? (
          <Select
            description={employee.province}
            onChange={(value) => onFormChange("provinceId", value || "")}
            data={provinceOptions}
            size="xs"
            searchable
          />
        ) : (
          employee.province
        )}
      </td>

      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
        {isEditing ? (
          <Select
            description={employee.ward}
            onChange={(value) => onFormChange("wardId", value || "")}
            data={wardOptions}
            size="xs"
            searchable
          />
        ) : (
          employee.ward
        )}
      </td>

      <td className="py-4 px-4 text-sm text-gray-700">
        {isEditing ? (
          <TextInput
            description={employee.email}
            value={editForm.email}
            onChange={(e) => onFormChange("email", e.target.value)}
            size="xs"
          />
        ) : (
          <Tooltip label={employee.email}>
            <div className="max-w-10 truncate">{employee.email}</div>
          </Tooltip>
        )}
      </td>

      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
        {isEditing ? (
          <Autocomplete
            description={employee.phone}
            data={countryCallingCodes}
            value={editForm.phone}
            onChange={(value) => onFormChange("phone", value)}
            size="xs"
          />
        ) : (
          employee.phone
        )}
      </td>

      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
        <Tooltip label={employee.department}>
          <div className="max-w-32 truncate">{employee.department}</div>
        </Tooltip>
      </td>

      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
        <Tooltip label={employee.position}>
          <div className="max-w-24 truncate">{employee.position}</div>
        </Tooltip>
      </td>

      <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <ActionButton
                kind="check"
                onClick={() => onSaveEdit(employee.employeeId)}
              />
              <ActionButton kind="cancel" onClick={onCancelEdit} />
            </>
          ) : (
            <>
              <ActionButton
                kind="edit"
                onClick={() => onStartEditing(employee)}
              />
              <button
                className="p-2 rounded-full"
                onClick={() => onTransfer(employee)}
                title="Chuyển nhân viên"
              >
                <RefreshCw size={16} className="text-gray-600 cursor-pointer" />
              </button>
            </>
          )}

          <ActionButton
            kind="print"
            onClick={() => onPrint(employee.employeeId)}
          />
        </div>
      </td>
    </tr>
  );
}
