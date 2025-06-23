"use client";

import { RouteGuard } from "@/components/auth/RouteGuard";
import ActionButton from "@/components/button/ActionButton";
import MainLayout from "@/components/layout/MainLayout";
import { del, fetcher, post, put } from "@/util/api";
import { notifyError } from "@/util/toast-util";
import { LoadingOverlay, Text, TextInput } from "@mantine/core";
import { modals } from "@mantine/modals";
import { Plus } from "lucide-react";
import { useState } from "react";
import useSWR, { mutate } from "swr";

export default function DepartmentsPage() {
  const {
    data: departments,
    error: departmentsError,
    isLoading: departmentsLoading,
  } = useSWR<{ departmentId: number; name: string }[]>(
    "/api/departments",
    fetcher
  );

  const [isAddingDepartment, setIsAddingDepartment] = useState(false);
  const [newDeptName, setNewDeptName] = useState("");

  const [editingDepartmentId, setEditingDepartmentId] = useState<number | null>(
    null
  );
  const [editDepartmentName, setEditDepartmentName] = useState("");

  const handleAddDepartment = async () => {
    if (/^[0-9]+$/.test(newDeptName.trim())) {
      notifyError("Tên phòng ban không được là số");
      return;
    }
    if (!newDeptName.trim()) return;
    try {
      await post(
        "/api/departments",
        JSON.stringify({ name: newDeptName.trim() })
      );
      mutate("/api/departments");
      setNewDeptName("");
      setIsAddingDepartment(false);
    } catch (error) {
      notifyError("Failed to add department");
    }
  };

  const handleEditDepartment = async (id: number) => {
    try {
      await put(
        `/api/departments/${id}`,
        JSON.stringify({ name: editDepartmentName })
      );
      mutate("/api/departments");
      setEditingDepartmentId(null);
      setEditDepartmentName("");
    } catch (error) {
      notifyError("Failed to edit department");
    }
  };

  const handleAskDeleteDepartment = (departmentName: string, id: number) => {
    modals.openConfirmModal({
      title: "Cảnh báo",
      centered: true,
      children: (
        <Text size="sm">Bạn có chắc chắn muốn xóa "{departmentName}"?</Text>
      ),
      labels: { confirm: `Xóa "${departmentName}"`, cancel: "Không, đừng xóa" },
      confirmProps: { color: "red" },
      onConfirm: () => handleDeleteDepartment(id),
    });
  };

  const handleDeleteDepartment = async (id: number) => {
    try {
      await del(`/api/departments/${id}`);
      mutate("/api/departments");
    } catch (error) {
      notifyError("Failed to delete department");
    }
  };

  const startEditingDepartment = (department: {
    departmentId: number;
    name: string;
  }) => {
    setEditingDepartmentId(department.departmentId);
    setEditDepartmentName(department.name);
  };
  return (
    <RouteGuard requiredRole="admin">
      <MainLayout activePath="/departments">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Phòng Ban</h1>
          <p className="text-gray-600">
            Quản lý phòng ban trong công ty của bạn
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-0 relative min-h-[200px] [&_button]:cursor-pointer">
            <LoadingOverlay visible={departmentsLoading} />
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2 className="text-lg font-semibold">Phòng Ban</h2>
              <button
                onClick={() => setIsAddingDepartment(true)}
                className="p-2 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                title="Thêm Phòng Ban"
                disabled={isAddingDepartment}
              >
                <Plus size={20} />
              </button>
            </div>
            {departmentsError ? (
              <div className="p-6 text-center text-red-600">
                Lỗi khi tải danh sách phòng ban
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tên
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Thao Tác
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {departments?.map((department) => (
                    <tr
                      key={department.departmentId}
                      className="hover:bg-gray-50 group"
                    >
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {editingDepartmentId === department.departmentId ? (
                          <TextInput
                            value={editDepartmentName}
                            onChange={(e) =>
                              setEditDepartmentName(e.currentTarget.value)
                            }
                            placeholder="Nhập tên phòng ban"
                            autoFocus
                          />
                        ) : (
                          department.name
                        )}
                      </td>
                      <td className="px-6 py-3 flex gap-2 justify-end">
                        {editingDepartmentId === department.departmentId ? (
                          <>
                            <ActionButton
                              onClick={() =>
                                handleEditDepartment(department.departmentId)
                              }
                              kind="check"
                            />
                            <ActionButton
                              onClick={() => {
                                setEditingDepartmentId(null);
                                setEditDepartmentName("");
                              }}
                              kind="cancel"
                            />
                          </>
                        ) : (
                          <>
                            <ActionButton
                              onClick={() => startEditingDepartment(department)}
                              kind="edit"
                            />
                            <ActionButton
                              onClick={() =>
                                handleAskDeleteDepartment(
                                  department.name,
                                  department.departmentId
                                )
                              }
                              kind="delete"
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {isAddingDepartment && (
                    <tr className="bg-blue-50">
                      <td className="px-6 py-3">
                        <TextInput
                          value={newDeptName}
                          onChange={(e) =>
                            setNewDeptName(e.currentTarget.value)
                          }
                          placeholder="Nhập tên phòng ban"
                          autoFocus
                        />
                      </td>
                      <td className="px-6 py-3 flex gap-2 justify-end">
                        {" "}
                        <ActionButton
                          onClick={handleAddDepartment}
                          kind="check"
                        />
                        <ActionButton
                          onClick={() => {
                            setIsAddingDepartment(false);
                            setNewDeptName("");
                          }}
                          kind="cancel"
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}{" "}
          </div>
        </div>
      </MainLayout>
    </RouteGuard>
  );
}
