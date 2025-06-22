"use client";

import { RouteGuard } from "@/components/auth/RouteGuard";
import MainLayout from "@/components/layout/MainLayout";
import { Autocomplete, Modal } from "@mantine/core";
import Link from "next/link";
import { useState } from "react";

const departmentData = {
  id: 1,
  name: "Engineering",
  description:
    "Responsible for developing and maintaining software products and internal tools.",
  manager: "Robert Chen",
  employeeCount: 42,
  location: "Floor 3, Building A",
  established: "2018-01-15",
  employees: [
    {
      id: 1,
      name: "John Doe",
      position: "Senior Developer",
      email: "john.doe@example.com",
      joinDate: "2018-03-15",
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Frontend Developer",
      email: "jane.smith@example.com",
      joinDate: "2019-06-20",
    },
    {
      id: 3,
      name: "Michael Brown",
      position: "Backend Developer",
      email: "michael.brown@example.com",
      joinDate: "2020-02-10",
    },
  ],
};

// Mock data for department list (for transfer)
const departmentList = [
  { id: 2, name: "Marketing" },
  { id: 3, name: "Sales" },
  { id: 4, name: "Human Resources" },
];

export default function DepartmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // In a real application, this would fetch data based on the ID
  const department = departmentData;

  const handleTransfer = (employeeId: number, targetDepartmentId: number) => {
    console.log(
      `Transfer employee ${employeeId} to department ${targetDepartmentId}`
    );
    setShowTransferModal(false);
    setSelectedEmployee(null);
  };

  const handleRemove = (employeeId: number) => {
    console.log(`Remove employee ${employeeId}`);
  };

  const handleAdd = () => {
    console.log("Add new employee");
    setShowAddModal(false);
  };
  return (
    <RouteGuard requiredRole="admin">
      <MainLayout activePath="/departments">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <Link
              href="/departments"
              className="text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold">{department.name}</h1>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 11h-6" />
              <path d="M20 8v6" />
            </svg>
            Add Employee
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Members</h2>
            <span className="text-sm text-gray-600">
              {department.employeeCount} total
            </span>
          </div>
          <div className="space-y-4">
            {department.employees.map((employee) => (
              <div
                key={employee.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    {employee.name
                      .split(" ")
                      .map((name) => name[0])
                      .join("")}
                  </div>
                  <div>
                    <Link
                      href={`/employees/${employee.id}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {employee.name}
                    </Link>
                    <p className="text-sm text-gray-600">{employee.position}</p>
                    <p className="text-xs text-gray-500">
                      Joined {new Date(employee.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedEmployee(employee.id);
                      setShowTransferModal(true);
                    }}
                    className="text-gray-600 hover:text-blue-600 p-2"
                    title="Transfer Employee"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 3v18" />
                      <path d="m12 8 5-5 5 5" />
                      <path d="M7 21v-18" />
                      <path d="m2 16 5 5 5-5" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleRemove(employee.id)}
                    className="text-gray-600 hover:text-red-600 p-2"
                    title="Remove Employee"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transfer Modal */}
        <Modal
          opened={showTransferModal}
          onClose={() => {
            setShowTransferModal(false);
            setSelectedEmployee(null);
          }}
          title="Transfer Employee"
          centered
        >
          <p className="text-sm text-gray-600 mb-4">
            Select a department to transfer the employee to:
          </p>
          <div className="space-y-2">
            {departmentList.map((dept) => (
              <button
                key={dept.id}
                onClick={() => handleTransfer(selectedEmployee!, dept.id)}
                className="w-full text-left px-4 py-2 rounded hover:bg-gray-100"
              >
                {dept.name}
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                setShowTransferModal(false);
                setSelectedEmployee(null);
              }}
              className="text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        </Modal>

        {/* Add Employee Modal */}
        <Modal
          opened={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Employee"
          centered
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAdd();
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <Autocomplete
                data={department.employees.map((emp) => emp.name)}
                placeholder="Type or select employee name"
                className="w-full"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Position
              </label>
              <Autocomplete
                data={[
                  ...new Set(department.employees.map((emp) => emp.position)),
                ]}
                placeholder="Type or select position"
                className="w-full"
                required
              />
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Employee
              </button>
            </div>
          </form>{" "}
        </Modal>
      </MainLayout>
    </RouteGuard>
  );
}
