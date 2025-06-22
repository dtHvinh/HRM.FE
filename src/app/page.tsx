"use client";

import EmployeeFilters from "@/components/employee/EmployeeFilters";
import EmployeePageHeader from "@/components/employee/EmployeePageHeader";
import EmployeeTable from "@/components/employee/EmployeeTable";
import MainLayout from "@/components/layout/MainLayout";
import ReportModal from "@/components/modal/ReportModal";
import SearchModal from "@/components/modal/SearchModal";
import TransferModal from "@/components/modal/TransferModal";
import { useEmployeeManagement } from "@/hooks/useEmployeeManagement";
import { handlePrintAllEmployees } from "@/util/employee-print";

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

export default function EmployeesPage() {
  const {
    // Data
    employees,
    departmentOptions,
    provinceOptions,
    wardOptions,

    // Filter states
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
    setReportEmployeeId,

    // Handlers
    startEditing,
    handleSaveEdit,
    handleCancelEdit,
    handleFormChange,
    handleTransfer,
    handlePrint,
  } = useEmployeeManagement();

  return (
    <MainLayout activePath="/">
      <EmployeePageHeader
        onSearch={() => setSearchModalOpen(true)}
        onPrintAll={() => handlePrintAllEmployees(employees)}
        onAdd={() => (window.location.href = "/employees/add")}
      />

      <EmployeeFilters
        provinceOptions={provinceOptions}
        wardOptions={wardOptions}
        departmentOptions={departmentOptions}
        onProvinceChange={setProvinceFilter}
        onWardChange={setWardFilter}
        onDepartmentChange={setDepartmentFilter}
        onGenderChange={setGenderFilter}
      />

      <EmployeeTable
        employees={employees}
        editingEmployeeId={editingEmployeeId}
        editForm={editForm}
        provinceOptions={provinceOptions}
        wardOptions={wardOptions}
        onStartEditing={startEditing}
        onSaveEdit={handleSaveEdit}
        onCancelEdit={handleCancelEdit}
        onTransfer={handleTransfer}
        onPrint={handlePrint}
        onFormChange={handleFormChange}
      />

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
