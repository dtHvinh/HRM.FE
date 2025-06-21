"use client";

import ActionButton from "@/components/button/ActionButton";
import MainLayout from "@/components/layout/MainLayout";
import ReportModal from "@/components/modal/ReportModal";
import SearchModal from "@/components/modal/SearchModal";
import TransferModal from "@/components/modal/TransferModal";
import { fetcher, put } from "@/util/api";
import { countryCallingCodes } from "@/util/dataset";
import { printContent } from "@/util/helper";
import { notifyError } from "@/util/toast-util";
import { Autocomplete, Select, TextInput, Tooltip } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

export interface GetEmployeeDTO {
  employeeId: number;
  fullName: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  province: string;
  ward: string;
}

const defaultForm = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  provinceId: "0",
  wardId: "0",
};

export default function EmployeesPage() {
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [provinceFilter, setProvinceFilter] = useState<string | null>(null);
  const [wardFilter, setWardFilter] = useState<string | null>(null);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  const [nameFilter, setNameFilter] = useState<string>("");
  const [debounceNameFilter] = useDebounce(nameFilter, 500);

  const { data: provinces } = useSWR<
    { provinceId: number; provinceName: string }[]
  >("/api/provinces", fetcher);
  const { data: wards } = useSWR<{ wardId: number; wardName: string }[]>(
    "/api/wards",
    fetcher
  );
  const { data: employees, mutate } = useSWR<GetEmployeeDTO[]>(
    `/api/employees?dep=${departmentFilter}&gen=${genderFilter}&province=${provinceFilter}&ward=${wardFilter}&name=${debounceNameFilter}&page=${page}&pageSize=${pageSize}`,
    fetcher
  );
  const { data: departments } = useSWR<
    { departmentId: number; name: string }[]
  >("/api/departments", fetcher);
  const departmentOptions =
    departments?.map((d) => ({
      value: d.departmentId.toString(),
      label: d.name,
    })) || [];
  const provinceOptions =
    provinces?.map((p) => ({
      value: p.provinceId.toString(),
      label: p.provinceName,
    })) || [];
  const wardOptions =
    wards?.map((w) => ({ value: w.wardId.toString(), label: w.wardName })) ||
    [];

  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(
    null
  );
  const [editForm, setEditForm] = useState(defaultForm);

  // Transfer modal state
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<GetEmployeeDTO | null>(null);

  // Report modal state
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportEmployeeId, setReportEmployeeId] = useState<number>(0);

  const startEditing = (employee: GetEmployeeDTO) => {
    setEditingEmployeeId(employee.employeeId);
    setEditForm({
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      provinceId: "0",
      wardId: "0",
    });
  };

  const handleSaveEdit = async (employeeId: number) => {
    try {
      await put(`/api/employees/${employeeId}`, JSON.stringify(editForm));
      await mutate();
      setEditingEmployeeId(null);
      setEditForm(defaultForm);
    } catch (error) {
      notifyError("Lỗi khi cập nhật nhân viên:");
    }
  };
  const handleCancelEdit = () => {
    setEditingEmployeeId(null);
    setEditForm({
      fullName: "",
      email: "",
      phone: "",
      dob: "",
      gender: "",
      provinceId: "",
      wardId: "",
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const getCurrentDate = () => {
    const now = new Date();
    return `Ngày ${now.getDate()} tháng ${
      now.getMonth() + 1
    } năm ${now.getFullYear()}`;
  };

  const handlePrintAllEmployees = () => {
    if (!employees || employees.length === 0) {
      notifyError("Không có nhân viên nào để in");
      return;
    }

    const employeeListContent = `
            <div class="bg-white font-sans">
                <div class="flex justify-between mb-8">
                    <div class="text-center">
                        <p class="font-bold uppercase mb-1">ĐÀI PT-TH AN GIANG</p>
                        <div class="w-16 h-0.5 bg-black mx-auto mb-1"></div>
                    </div>
                    <div class="text-center">
                        <p class="font-bold uppercase mb-1">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
                        <p class="mb-1">Độc lập - Tự do - Hạnh phúc</p>
                        <div class="w-32 h-0.5 bg-black mx-auto mb-1"></div>
                    </div>
                </div>

                <div class="text-center mb-8">
                    <h1 class="text-xl font-bold uppercase">DANH SÁCH NHÂN VIÊN</h1>
                </div>

                <div class="mb-6">
                    <p class="text-center">Tổng số nhân viên: ${
                      employees.length
                    }</p>
                </div>

                <table class="w-full border-collapse border border-black text-sm">
                    <thead>
                        <tr class="bg-gray-100">
                            <th class="border border-black p-2 text-left">STT</th>
                            <th class="border border-black p-2 text-left">Họ Tên</th>
                            <th class="border border-black p-2 text-left">Ngày Sinh</th>
                            <th class="border border-black p-2 text-left">Giới Tính</th>
                            <th class="border border-black p-2 text-left">Email</th>
                            <th class="border border-black p-2 text-left">Điện Thoại</th>
                            <th class="border border-black p-2 text-left">Phòng Ban</th>
                            <th class="border border-black p-2 text-left">Chức Vụ</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${employees
                          .map(
                            (employee, index) => `
                            <tr>
                                <td class="border border-black p-2">${
                                  index + 1
                                }</td>
                                <td class="border border-black p-2">${
                                  employee.fullName
                                }</td>
                                <td class="border border-black p-2">${formatDate(
                                  employee.dob
                                )}</td>
                                <td class="border border-black p-2">${
                                  employee.gender === "Male"
                                    ? "Nam"
                                    : employee.gender === "Female"
                                    ? "Nữ"
                                    : employee.gender
                                }</td>
                                <td class="border border-black p-2">${
                                  employee.email
                                }</td>
                                <td class="border border-black p-2">${
                                  employee.phone
                                }</td>
                                <td class="border border-black p-2">${
                                  employee.department
                                }</td>
                                <td class="border border-black p-2">${
                                  employee.position
                                }</td>
                            </tr>
                        `
                          )
                          .join("")}
                    </tbody>
                </table>

                <div class="flex justify-end mt-12">
                    <div class="text-center w-64">
                        <div>
                            <p>${getCurrentDate()}</p>
                        </div>
                        <p class="font-bold">NGƯỜI LẬP BÁO CÁO</p>
                        <p class="italic">(Ký, ghi rõ họ tên)</p>
                        <div class="h-20"></div>
                    </div>
                </div>
            </div>
        `;

    printContent(employeeListContent);
  };

  return (
    <MainLayout activePath="/">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Nhân Viên</h1>
          <p className="text-gray-700">Quản lý nhân viên của bạn</p>
        </div>{" "}
        <div className="flex gap-5">
          <div className="flex items-center gap-2">
            <ActionButton
              kind="search"
              onClick={() => setSearchModalOpen(true)}
            />
            <ActionButton kind="print" onClick={handlePrintAllEmployees} />
          </div>
          <ActionButton
            kind="add"
            onClick={() => (window.location.href = "/employees/add")}
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Select
              label="Tỉnh/Thành Phố"
              placeholder="Chọn tỉnh/thành phố"
              description="Chọn tỉnh/thành phố"
              data={provinceOptions}
              onChange={(value) => setProvinceFilter(value)}
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
              onChange={(value) => setWardFilter(value)}
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
              onChange={(value) => setDepartmentFilter(value)}
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
              onChange={(value) => setGenderFilter(value)}
              searchable
              required
            />
          </div>
        </div>
      </div>

      {/* Employees Table */}
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
                        {editingEmployeeId === employee.employeeId ? (
                          <TextInput
                            description={employee.fullName}
                            value={editForm.fullName}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                fullName: e.target.value,
                              })
                            }
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
                    {editingEmployeeId === employee.employeeId ? (
                      <DateInput
                        description={new Date(
                          employee.dob
                        ).toLocaleDateString()}
                        value={editForm.dob ? new Date(editForm.dob) : null}
                        onChange={(date) =>
                          setEditForm({
                            ...editForm,
                            dob: date ? date.toString() : "",
                          })
                        }
                        size="xs"
                        valueFormat="DD/MM/YYYY"
                      />
                    ) : (
                      new Date(employee.dob).toLocaleDateString()
                    )}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                    {editingEmployeeId === employee.employeeId ? (
                      <Select
                        description={employee.gender}
                        value={editForm.gender}
                        onChange={(value) =>
                          setEditForm({ ...editForm, gender: value || "" })
                        }
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
                    {editingEmployeeId === employee.employeeId ? (
                      <Select
                        description={employee.province}
                        onChange={(value) => {
                          setEditForm({ ...editForm, provinceId: value || "" });
                        }}
                        data={provinceOptions}
                        size="xs"
                        searchable
                      />
                    ) : (
                      employee.province
                    )}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                    {editingEmployeeId === employee.employeeId ? (
                      <Select
                        description={employee.ward}
                        onChange={(value) =>
                          setEditForm({ ...editForm, wardId: value || "" })
                        }
                        data={wardOptions}
                        size="xs"
                        searchable
                      />
                    ) : (
                      employee.ward
                    )}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">
                    {editingEmployeeId === employee.employeeId ? (
                      <TextInput
                        description={employee.email}
                        value={editForm.email}
                        onChange={(e) =>
                          setEditForm({ ...editForm, email: e.target.value })
                        }
                        size="xs"
                      />
                    ) : (
                      <Tooltip label={employee.email}>
                        <div className="max-w-10 truncate">
                          {employee.email}
                        </div>
                      </Tooltip>
                    )}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                    {editingEmployeeId === employee.employeeId ? (
                      <Autocomplete
                        description={employee.phone}
                        data={countryCallingCodes}
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e })}
                        size="xs"
                      />
                    ) : (
                      employee.phone
                    )}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                    <Tooltip label={employee.department}>
                      <div className="max-w-32 truncate">
                        {employee.department}
                      </div>
                    </Tooltip>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                    <Tooltip label={employee.position}>
                      <div className="max-w-24 truncate">
                        {employee.position}
                      </div>
                    </Tooltip>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      {editingEmployeeId === employee.employeeId ? (
                        <>
                          <ActionButton
                            kind="check"
                            onClick={() => handleSaveEdit(employee.employeeId)}
                          />
                          <ActionButton
                            kind="cancel"
                            onClick={handleCancelEdit}
                          />
                        </>
                      ) : (
                        <>
                          <ActionButton
                            kind="edit"
                            onClick={() => startEditing(employee)}
                          />
                          <button
                            className="p-2 rounded-full"
                            onClick={() => {
                              setSelectedEmployee(employee);
                              setTransferModalOpen(true);
                            }}
                            title="Chuyển nhân viên"
                          >
                            <RefreshCw
                              size={16}
                              className="text-gray-600 cursor-pointer"
                            />
                          </button>
                        </>
                      )}

                      <ActionButton
                        kind="print"
                        onClick={() => {
                          setReportEmployeeId(employee.employeeId);
                          setReportModalOpen(true);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search Modal */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        value={nameFilter}
        onChange={setNameFilter}
      />

      {/* Transfer Modal */}
      {selectedEmployee && (
        <TransferModal
          isOpen={transferModalOpen}
          onClose={() => {
            setTransferModalOpen(false);
            setSelectedEmployee(null);
          }}
          employeeId={selectedEmployee.employeeId}
          employeeName={selectedEmployee.fullName}
          currentDepartment={selectedEmployee.department}
          currentPosition={selectedEmployee.position}
        />
      )}

      {/* Report Modal */}
      <ReportModal
        employeeId={reportEmployeeId}
        isOpen={reportModalOpen}
        onClose={() => {
          setReportModalOpen(false);
          setReportEmployeeId(0);
        }}
      />
    </MainLayout>
  );
}
