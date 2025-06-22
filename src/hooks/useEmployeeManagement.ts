"use client";

import { GetEmployeeDTO } from "@/app/page";
import { fetcher, put } from "@/util/api";
import { notifyError } from "@/util/toast-util";
import { useState } from "react";
import useSWR from "swr";
import { useDebounce } from "use-debounce";

const defaultForm = {
  fullName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "",
  provinceId: "0",
  wardId: "0",
};

export const useEmployeeManagement = () => {
  // Filter states
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<string | null>(null);
  const [provinceFilter, setProvinceFilter] = useState<string | null>(null);
  const [wardFilter, setWardFilter] = useState<string | null>(null);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [debounceNameFilter] = useDebounce(nameFilter, 500);

  // Pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(100);

  // Modal states
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] =
    useState<GetEmployeeDTO | null>(null);
  const [reportEmployeeId, setReportEmployeeId] = useState<number>(0);

  // Edit states
  const [editingEmployeeId, setEditingEmployeeId] = useState<number | null>(
    null
  );
  const [editForm, setEditForm] = useState(defaultForm);

  // Data fetching
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

  // Options for dropdowns
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
  // Handlers
  const startEditing = (employee: GetEmployeeDTO) => {
    setEditingEmployeeId(employee.employeeId);
    // Populate the form with current employee data
    setEditForm({
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      dob: employee.dob,
      gender: employee.gender,
      provinceId: "0", // You might want to map these from the employee data if available
      wardId: "0",
    });
  };

  // Form validation function
  const validateForm = (form: typeof editForm) => {
    const errors: string[] = [];

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim()) {
      errors.push("Yêu cầu nhập email");
    } else if (!emailRegex.test(form.email)) {
      errors.push("Email không hợp lệ");
    }

    // Validate phone number
    const phoneRegex = /^\d+$/; // Only digits
    if (!form.phone.trim()) {
      errors.push("Số điện thoại là bắt buộc");
    } else if (!phoneRegex.test(form.phone)) {
      errors.push("Số điện thoại chỉ được chứa số");
    } else if (form.phone.length < 10) {
      errors.push("Số điện thoại phải có ít nhất 10 chữ số");
    }

    // Validate age (must be 18 or older)
    if (form.dob) {
      const today = new Date();
      const birthDate = new Date(form.dob);
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();

      // Adjust age if birthday hasn't occurred this year
      const actualAge =
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < birthDate.getDate())
          ? age - 1
          : age;

      if (actualAge < 18) {
        errors.push("Nhân viên phải từ 18 tuổi trở lên");
      }
    } else {
      errors.push("Ngày sinh là bắt buộc");
    }

    // Validate full name
    if (!form.fullName.trim()) {
      errors.push("Họ tên là bắt buộc");
    }

    return errors;
  };

  const handleSaveEdit = async (employeeId: number) => {
    try {
      console.log("Attempting to save employee:", employeeId);
      console.log("Form data being sent:", editForm);

      // Validate form before sending
      const validationErrors = validateForm(editForm);
      console.log(validationErrors);
      if (validationErrors.length > 0) {
        // Show all validation errors
        validationErrors.forEach((error) => notifyError(error));
        return;
      }

      const response = await put(
        `/api/employees/${employeeId}`,
        JSON.stringify(editForm)
      );
      console.log("Save response:", response);

      await mutate();
      setEditingEmployeeId(null);
      setEditForm(defaultForm);

      console.log("Employee updated successfully");
    } catch (error) {
      console.error("Error updating employee:", error);
      notifyError("Lỗi khi cập nhật nhân viên:");
    }
  };

  const handleCancelEdit = () => {
    setEditingEmployeeId(null);
    setEditForm(defaultForm);
  };

  const handleFormChange = (field: string, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleTransfer = (employee: GetEmployeeDTO) => {
    setSelectedEmployee(employee);
    setTransferModalOpen(true);
  };

  const handlePrint = (employeeId: number) => {
    setReportEmployeeId(employeeId);
    setReportModalOpen(true);
  };

  return {
    // Data
    employees,
    provinces,
    wards,
    departments,

    // Options
    departmentOptions,
    provinceOptions,
    wardOptions,

    // Filter states
    departmentFilter,
    genderFilter,
    provinceFilter,
    wardFilter,
    nameFilter,

    // Modal states
    searchModalOpen,
    transferModalOpen,
    reportModalOpen,
    selectedEmployee,
    reportEmployeeId,

    // Edit states
    editingEmployeeId,
    editForm,

    // Filter setters
    setDepartmentFilter,
    setGenderFilter,
    setProvinceFilter,
    setWardFilter,
    setNameFilter,

    // Modal setters
    setSearchModalOpen,
    setTransferModalOpen,
    setReportModalOpen,
    setSelectedEmployee,
    setReportEmployeeId, // Handlers
    startEditing,
    handleSaveEdit,
    handleCancelEdit,
    handleFormChange,
    handleTransfer,
    handlePrint,

    // Validation
    validateForm,
  };
};
