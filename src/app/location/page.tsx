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

export default function LocationPage() {
  const {
    data: provinces,
    error: provincesError,
    isLoading: provincesLoading,
  } = useSWR<{ provinceId: number; provinceName: string }[]>(
    "/api/provinces",
    fetcher
  );
  const {
    data: wards,
    error: wardsError,
    isLoading: wardsLoading,
  } = useSWR<{ wardId: number; wardName: string }[]>("/api/wards", fetcher);

  // State for inline editing
  const [isAddingProvince, setIsAddingProvince] = useState(false);
  const [isAddingWard, setIsAddingWard] = useState(false);
  const [newProvinceName, setNewProvinceName] = useState("");
  const [newWardName, setNewWardName] = useState("");

  // State for editing existing items
  const [editingProvinceId, setEditingProvinceId] = useState<number | null>(
    null
  );
  const [editingWardId, setEditingWardId] = useState<number | null>(null);
  const [editProvinceName, setEditProvinceName] = useState("");
  const [editWardName, setEditWardName] = useState("");

  const validateName = (name: string): boolean => {
    if (!name || name.trim() === "") return false;

    // Check if name contains any numbers
    return !/\d/.test(name.trim());
  };

  const handleAddProvince = async () => {
    if (!newProvinceName.trim()) {
      notifyError("Vui lòng nhập tên tỉnh/thành phố");
      return;
    }

    if (!validateName(newProvinceName)) {
      notifyError("Tên tỉnh/thành phố không được chứa số");
      return;
    }

    try {
      await post("/api/provinces", JSON.stringify({ name: newProvinceName }));
      mutate("/api/provinces");
      setNewProvinceName("");
      setIsAddingProvince(false);
    } catch (error) {
      notifyError("Không thể thêm");
    }
  };
  const handleEditProvince = async (id: number) => {
    if (!editProvinceName.trim()) {
      notifyError("Vui lòng nhập tên tỉnh/thành phố");
      return;
    }

    if (!validateName(editProvinceName)) {
      notifyError("Tên tỉnh/thành phố không được chứa số");
      return;
    }

    try {
      await put(
        `/api/provinces/${id}`,
        JSON.stringify({ name: editProvinceName })
      );
      mutate("/api/provinces");
      setEditingProvinceId(null);
      setEditProvinceName("");
    } catch (error) {
      notifyError("Không thể chỉnh sửa");
    }
  };

  const handleAskDeleteProvince = (provinceName: string, id: number) => {
    modals.openConfirmModal({
      title: "Cảnh báo",
      centered: true,
      children: (
        <Text size="sm">Bạn có chắc chắn muốn xóa "{provinceName}"?</Text>
      ),
      labels: { confirm: `Xóa "${provinceName}"`, cancel: "Không, đừng xóa" },
      confirmProps: { color: "red" },
      onConfirm: () => handleDeleteProvince(id),
    });
  };

  const handleDeleteProvince = async (id: number) => {
    try {
      await del(`/api/provinces/${id}`);
      mutate("/api/provinces");
    } catch (error) {
      notifyError("Không thể xóa");
    }
  };
  const handleAddWard = async () => {
    if (!newWardName.trim()) {
      notifyError("Vui lòng nhập tên quận/huyện");
      return;
    }

    if (!validateName(newWardName)) {
      notifyError("Tên quận/huyện không được chứa số");
      return;
    }

    try {
      await post("/api/wards", JSON.stringify({ name: newWardName }));
      mutate("/api/wards");
      setNewWardName("");
      setIsAddingWard(false);
    } catch (error) {
      notifyError("Không thể thêm");
    }
  };
  const handleEditWard = async (id: number) => {
    if (!editWardName.trim()) {
      notifyError("Vui lòng nhập tên quận/huyện");
      return;
    }

    if (!validateName(editWardName)) {
      notifyError("Tên quận/huyện không được chứa số");
      return;
    }

    try {
      await put(`/api/wards/${id}`, JSON.stringify({ wardName: editWardName }));
      mutate("/api/wards");
      setEditingWardId(null);
      setEditWardName("");
    } catch (error) {
      notifyError("Không thể chỉnh sửa");
    }
  };

  const handleAskDeleteWard = (wardName: string, id: number) => {
    modals.openConfirmModal({
      title: "Cảnh báo",
      centered: true,
      children: <Text size="sm">Bạn có chắc chắn muốn xóa "{wardName}"?</Text>,
      labels: { confirm: `Xóa "${wardName}"`, cancel: "Không, đừng xóa" },
      confirmProps: { color: "red" },
      onConfirm: () => handleDeleteWard(id),
    });
  };

  const handleDeleteWard = async (id: number) => {
    try {
      await del(`/api/wards/${id}`);
      mutate("/api/wards");
    } catch (error) {
      notifyError("Không thể xóa");
    }
  };

  const startEditingProvince = (province: {
    provinceId: number;
    provinceName: string;
  }) => {
    setEditingProvinceId(province.provinceId);
    setEditProvinceName(province.provinceName);
  };

  const startEditingWard = (ward: { wardId: number; wardName: string }) => {
    setEditingWardId(ward.wardId);
    setEditWardName(ward.wardName);
  };
  return (
    <RouteGuard requiredRole="admin">
      <MainLayout activePath="/location">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Quản Lý Địa Điểm</h1>
        </div>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-8">
          {/* Provinces Table */}
          <div className="p-0 mb-8 md:mb-0 relative min-h-[200px]">
            <LoadingOverlay visible={provincesLoading} />
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2 className="text-lg font-semibold">Tỉnh</h2>
              <button
                onClick={() => setIsAddingProvince(true)}
                className="p-2 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                title="Thêm Tỉnh"
                disabled={isAddingProvince}
              >
                <Plus size={20} />
              </button>
            </div>
            {provincesError ? (
              <div className="p-6 text-center text-red-600">
                Lỗi khi tải danh sách tỉnh/thành phố
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tên
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {provinces?.map((province) => (
                    <tr
                      key={province.provinceId}
                      className="hover:bg-gray-50 group"
                    >
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {" "}
                        {editingProvinceId === province.provinceId ? (
                          <TextInput
                            value={editProvinceName}
                            onChange={(e) =>
                              setEditProvinceName(e.currentTarget.value)
                            }
                            error={
                              editProvinceName &&
                              !validateName(editProvinceName)
                                ? "Tên không được chứa số"
                                : undefined
                            }
                            autoFocus
                          />
                        ) : (
                          province.provinceName
                        )}
                      </td>
                      <td className="px-6 py-3 flex gap-2 justify-end">
                        {editingProvinceId === province.provinceId ? (
                          <>
                            <ActionButton
                              kind="check"
                              onClick={() =>
                                handleEditProvince(province.provinceId)
                              }
                            />
                            <ActionButton
                              kind="cancel"
                              onClick={() => {
                                setEditingProvinceId(null);
                                setEditProvinceName("");
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <ActionButton
                              kind="edit"
                              onClick={() => startEditingProvince(province)}
                            />
                            <ActionButton
                              kind="delete"
                              onClick={() =>
                                handleAskDeleteProvince(
                                  province.provinceName,
                                  province.provinceId
                                )
                              }
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {isAddingProvince && (
                    <tr className="bg-blue-50">
                      {" "}
                      <td className="px-6 py-3">
                        <TextInput
                          value={newProvinceName}
                          onChange={(e) =>
                            setNewProvinceName(e.currentTarget.value)
                          }
                          placeholder="Nhập tên tỉnh/thành phố"
                          error={
                            newProvinceName && !validateName(newProvinceName)
                              ? "Tên không được chứa số"
                              : undefined
                          }
                          autoFocus
                        />
                      </td>
                      <td className="px-6 py-3 flex gap-2 justify-end">
                        <ActionButton
                          kind="check"
                          onClick={handleAddProvince}
                        />
                        <ActionButton
                          kind="cancel"
                          onClick={() => {
                            setIsAddingProvince(false);
                            setNewProvinceName("");
                          }}
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Wards Table */}
          <div className="p-0 relative">
            <LoadingOverlay visible={wardsLoading} />
            <div className="flex items-center justify-between px-6 pt-6 pb-2">
              <h2 className="text-lg font-semibold">Thành phố</h2>
              <button
                onClick={() => setIsAddingWard(true)}
                className="p-2 hover:text-gray-800 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                title="Thành phố"
                disabled={isAddingWard}
              >
                <Plus size={20} />
              </button>
            </div>
            {wardsError ? (
              <div className="p-6 text-center text-red-600">
                Lỗi khi tải danh sách phường/xã
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Tên
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {wards?.map((ward) => (
                    <tr key={ward.wardId} className="hover:bg-gray-50 group">
                      <td className="px-6 py-3 text-sm text-gray-900">
                        {" "}
                        {editingWardId === ward.wardId ? (
                          <TextInput
                            value={editWardName}
                            onChange={(e) =>
                              setEditWardName(e.currentTarget.value)
                            }
                            error={
                              editWardName && !validateName(editWardName)
                                ? "Tên không được chứa số"
                                : undefined
                            }
                            autoFocus
                          />
                        ) : (
                          ward.wardName
                        )}
                      </td>
                      <td className="px-6 py-3 flex gap-2 justify-end">
                        {editingWardId === ward.wardId ? (
                          <>
                            <ActionButton
                              kind="check"
                              onClick={() => handleEditWard(ward.wardId)}
                            />
                            <ActionButton
                              kind="cancel"
                              onClick={() => {
                                setEditingWardId(null);
                                setEditWardName("");
                              }}
                            />
                          </>
                        ) : (
                          <>
                            <ActionButton
                              kind="edit"
                              onClick={() => startEditingWard(ward)}
                            />
                            <ActionButton
                              kind="delete"
                              onClick={() =>
                                handleAskDeleteWard(ward.wardName, ward.wardId)
                              }
                            />
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                  {isAddingWard && (
                    <tr className="bg-blue-50">
                      {" "}
                      <td className="px-6 py-3">
                        <TextInput
                          value={newWardName}
                          onChange={(e) =>
                            setNewWardName(e.currentTarget.value)
                          }
                          placeholder="Nhập tên phường/xã"
                          error={
                            newWardName && !validateName(newWardName)
                              ? "Tên không được chứa số"
                              : undefined
                          }
                          autoFocus
                        />
                      </td>
                      <td className="px-6 py-3 flex gap-2 justify-end">
                        <ActionButton kind="check" onClick={handleAddWard} />
                        <ActionButton
                          kind="cancel"
                          onClick={() => {
                            setIsAddingWard(false);
                            setNewWardName("");
                          }}
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
