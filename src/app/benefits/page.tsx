"use client";

import { RouteGuard } from "@/components/auth/RouteGuard";
import ActionButton from "@/components/button/ActionButton";
import MainLayout from "@/components/layout/MainLayout";
import { del, fetcher, post, put } from "@/util/api";
import { notifyError, notifySuccess } from "@/util/toast-util";
import {
  Badge,
  Button,
  Modal,
  NumberInput,
  Table,
  Tabs,
  TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import useSWR from "swr";

interface Insurance {
  insuranceId: number;
  insuranceName: string;
  insuranceCoefficient: number;
}

interface Allowance {
  allowanceId: number;
  allowanceName: string;
  allowanceCoefficient: number;
}

const defaultInsuranceForm = {
  insuranceName: "",
  insuranceCoefficient: "",
};

const defaultAllowanceForm = {
  allowanceName: "",
  allowanceCoefficient: "",
};

export default function BenefitsPage() {
  // Tab state
  const [activeTab, setActiveTab] = useState<string | null>("insurance");

  // Modal states
  const [opened, { open, close }] = useDisclosure(false);
  const [
    deleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [modalTitle, setModalTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<number | null>(null);

  // Insurance management state
  const {
    data: insurances,
    error: insuranceError,
    mutate: insuranceMutate,
  } = useSWR<Insurance[]>("/api/insurances", fetcher);
  const [insuranceForm, setInsuranceForm] = useState<{
    insuranceName: string;
    insuranceCoefficient: string | number;
  }>(defaultInsuranceForm);

  // Allowance management state
  const {
    data: allowances,
    error: allowanceError,
    mutate: allowanceMutate,
  } = useSWR<Allowance[]>("/api/allowances", fetcher);
  const [allowanceForm, setAllowanceForm] = useState<{
    allowanceName: string;
    allowanceCoefficient: string | number;
  }>(defaultAllowanceForm);

  // Handle opening the add/edit modal
  const handleOpenModal = (
    type: "insurance" | "allowance",
    action: "add" | "edit",
    item?: Insurance | Allowance
  ) => {
    setActiveTab(type);
    setIsEditing(action === "edit");
    setModalTitle(
      `${action === "add" ? "Thêm" : "Sửa"} ${
        type === "insurance" ? "Bảo Hiểm" : "Phụ Cấp"
      }`
    );

    if (action === "edit" && item) {
      if (type === "insurance") {
        const insurance = item as Insurance;
        setInsuranceForm({
          insuranceName: insurance.insuranceName,
          insuranceCoefficient: insurance.insuranceCoefficient,
        });
        setCurrentItemId(insurance.insuranceId);
      } else {
        const allowance = item as Allowance;
        setAllowanceForm({
          allowanceName: allowance.allowanceName,
          allowanceCoefficient: allowance.allowanceCoefficient,
        });
        setCurrentItemId(allowance.allowanceId);
      }
    } else {
      // Reset forms when adding new
      if (type === "insurance") {
        setInsuranceForm(defaultInsuranceForm);
      } else {
        setAllowanceForm(defaultAllowanceForm);
      }
      setCurrentItemId(null);
    }

    open();
  };

  // Handle opening the delete confirmation modal
  const handleOpenDeleteModal = (
    type: "insurance" | "allowance",
    id: number
  ) => {
    setActiveTab(type);
    setCurrentItemId(id);
    openDeleteModal();
  };

  // Handle form submission for insurance
  const handleInsuranceSubmit = async () => {
    try {
      if (isEditing && currentItemId) {
        console.log(insuranceForm);
        await put(
          `/api/insurances/${currentItemId}`,
          JSON.stringify(insuranceForm)
        );
        notifySuccess("Successfully updated insurance");
      } else {
        await post("/api/insurances", JSON.stringify(insuranceForm));
        notifySuccess("Successfully added insurance");
      }
      insuranceMutate();
      close();
      setInsuranceForm(defaultInsuranceForm);
    } catch (error) {
      notifyError(`Error ${isEditing ? "updating" : "adding"} insurance`);
    }
  };

  // Handle form submission for allowance
  const handleAllowanceSubmit = async () => {
    try {
      if (isEditing && currentItemId) {
        await put(
          `/api/allowances/${currentItemId}`,
          JSON.stringify(allowanceForm)
        );
        notifySuccess("Successfully updated allowance");
      } else {
        await post("/api/allowances", JSON.stringify(allowanceForm));
        notifySuccess("Successfully added allowance");
      }
      allowanceMutate();
      close();
      setAllowanceForm(defaultAllowanceForm);
    } catch (error) {
      notifyError(`Error ${isEditing ? "updating" : "adding"} allowance`);
    }
  };

  // Handle delete
  const handleDelete = async () => {
    try {
      if (activeTab === "insurance" && currentItemId) {
        await del(`/api/insurances/${currentItemId}`);
        insuranceMutate();
        notifySuccess("Successfully deleted insurance");
      } else if (activeTab === "allowance" && currentItemId) {
        await del(`/api/allowances/${currentItemId}`);
        allowanceMutate();
        notifySuccess("Successfully deleted allowance");
      }
      closeDeleteModal();
    } catch (error) {
      notifyError(`Error deleting ${activeTab}`);
    }
  };
  return (
    <RouteGuard requiredRole="admin">
      <MainLayout activePath="/benefits">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Quản Lý Phúc Lợi</h1>
            <p className="text-gray-700">Quản lý bảo hiểm và phụ cấp</p>
          </div>
        </div>

        <div className="p-6">
          <Tabs value={activeTab} onChange={setActiveTab} className="mb-4">
            <Tabs.List>
              <Tabs.Tab value="insurance">Bảo Hiểm</Tabs.Tab>
              <Tabs.Tab value="allowance">Phụ Cấp</Tabs.Tab>
            </Tabs.List>
          </Tabs>

          {activeTab === "insurance" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Bảo Hiểm</h2>
                <ActionButton
                  kind="add"
                  onClick={() => handleOpenModal("insurance", "add")}
                />
              </div>

              {!insurances || insurances.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
                  Chưa có bảo hiểm nào
                </div>
              ) : (
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Tên Bảo Hiểm</Table.Th>
                      <Table.Th>Hệ Số</Table.Th>
                      <Table.Th>Thao Tác</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {insurances.map((insurance) => (
                      <Table.Tr key={insurance.insuranceId}>
                        <Table.Td>{insurance.insuranceName}</Table.Td>
                        <Table.Td>
                          <Badge size="sm" color="blue" variant="light">
                            {insurance.insuranceCoefficient.toFixed(2)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex space-x-2">
                            <ActionButton
                              kind="edit"
                              onClick={() =>
                                handleOpenModal("insurance", "edit", insurance)
                              }
                            />
                            <ActionButton
                              kind="delete"
                              onClick={() =>
                                handleOpenDeleteModal(
                                  "insurance",
                                  insurance.insuranceId
                                )
                              }
                            />
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </>
          )}

          {activeTab === "allowance" && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Phụ Cấp</h2>
                <ActionButton
                  kind="add"
                  onClick={() => handleOpenModal("allowance", "add")}
                />
              </div>

              {!allowances || allowances.length === 0 ? (
                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-md">
                  Chưa có phụ cấp nào
                </div>
              ) : (
                <Table striped highlightOnHover>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Tên Phụ Cấp</Table.Th>
                      <Table.Th>Hệ Số</Table.Th>
                      <Table.Th>Thao Tác</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {allowances.map((allowance) => (
                      <Table.Tr key={allowance.allowanceId}>
                        <Table.Td>{allowance.allowanceName}</Table.Td>
                        <Table.Td>
                          <Badge size="sm" color="green" variant="light">
                            {allowance.allowanceCoefficient.toFixed(2)}
                          </Badge>
                        </Table.Td>
                        <Table.Td>
                          <div className="flex space-x-2">
                            <ActionButton
                              kind="edit"
                              onClick={() =>
                                handleOpenModal("allowance", "edit", allowance)
                              }
                            />
                            <ActionButton
                              kind="delete"
                              onClick={() =>
                                handleOpenDeleteModal(
                                  "allowance",
                                  allowance.allowanceId
                                )
                              }
                            />
                          </div>
                        </Table.Td>
                      </Table.Tr>
                    ))}
                  </Table.Tbody>
                </Table>
              )}
            </>
          )}
        </div>

        {/* Add/Edit Modal */}
        <Modal opened={opened} onClose={close} title={modalTitle} centered>
          {activeTab === "insurance" ? (
            <div className="space-y-4">
              <TextInput
                label="Tên Bảo Hiểm"
                placeholder="Nhập tên bảo hiểm"
                value={insuranceForm.insuranceName}
                onChange={(e) =>
                  setInsuranceForm({
                    ...insuranceForm,
                    insuranceName: e.target.value,
                  })
                }
                required
              />

              <NumberInput
                label="Hệ Số Bảo Hiểm"
                placeholder="Nhập hệ số"
                value={insuranceForm.insuranceCoefficient}
                onChange={(value) =>
                  setInsuranceForm({
                    ...insuranceForm,
                    insuranceCoefficient: value,
                  })
                }
                required
                min={0}
              />

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={close}>
                  Hủy
                </Button>
                <Button onClick={handleInsuranceSubmit}>
                  {isEditing ? "Cập Nhật" : "Thêm"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <TextInput
                label="Tên Phụ Cấp"
                placeholder="Nhập tên phụ cấp"
                value={allowanceForm.allowanceName}
                onChange={(e) =>
                  setAllowanceForm({
                    ...allowanceForm,
                    allowanceName: e.target.value,
                  })
                }
                required
              />

              <NumberInput
                label="Hệ Số Phụ Cấp"
                placeholder="Nhập hệ số"
                value={allowanceForm.allowanceCoefficient}
                onChange={(value) =>
                  setAllowanceForm({
                    ...allowanceForm,
                    allowanceCoefficient: value,
                  })
                }
                required
                min={0}
              />

              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={close}>
                  Hủy
                </Button>
                <Button onClick={handleAllowanceSubmit}>
                  {isEditing ? "Cập Nhật" : "Thêm"}
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          opened={deleteModalOpened}
          onClose={closeDeleteModal}
          title="Xác Nhận Xóa"
          centered
        >
          <div className="space-y-4">
            <p>
              Bạn có chắc chắn muốn xóa{" "}
              {activeTab === "insurance" ? "bảo hiểm" : "phụ cấp"} này? Hành
              động này không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={closeDeleteModal}>
                Hủy
              </Button>
              <Button color="red" onClick={handleDelete}>
                Xóa
              </Button>
            </div>{" "}
          </div>
        </Modal>
      </MainLayout>
    </RouteGuard>
  );
}
