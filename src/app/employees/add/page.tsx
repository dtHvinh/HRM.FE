"use client";

import MainLayout from "@/components/layout/MainLayout";
import { fetcher, post } from "@/util/api";
import { notifyError, notifySuccess } from "@/util/toast-util";
import { Button, Select, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useRouter } from "next/navigation";
import { useState } from "react";
import useSWR from "swr";

export default function AddEmployeePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [form, setForm] = useState({
    fullName: "",
    dob: "",
    gender: "",
    email: "",
    phone: "",
    departmentId: "",
    positionId: "",
    provinceId: "",
    wardId: "",
  });

  const { data: provinces } = useSWR<
    { provinceId: number; provinceName: string }[]
  >("/api/provinces", fetcher);
  const { data: wards } = useSWR<{ wardId: number; wardName: string }[]>(
    "/api/wards",
    fetcher
  );
  const { data: departments } = useSWR<
    { departmentId: number; name: string }[]
  >("/api/departments", fetcher);
  const { data: positions } = useSWR<{ positionId: number; name: string }[]>(
    "/api/positions",
    fetcher
  );

  const provinceOptions =
    provinces?.map((p: any) => ({
      value: p.provinceId.toString(),
      label: p.provinceName,
    })) || [];
  const wardOptions =
    wards?.map((w: any) => ({
      value: w.wardId.toString(),
      label: w.wardName,
    })) || [];
  const departmentOptions =
    departments?.map((d: any) => ({
      value: d.departmentId.toString(),
      label: d.name,
    })) || [];
  const positionOptions =
    positions?.map((p: any) => ({
      value: p.positionId.toString(),
      label: p.name,
    })) || [];
  const validateAge = (dateOfBirth: string): boolean => {
    if (!dateOfBirth) return false;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // Check if birthday hasn't occurred this year yet
    const actualAge =
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ? age - 1
        : age;

    return actualAge >= 18;
  };

  const validatePhoneNumber = (phone: string): boolean => {
    if (!phone || phone.trim() === "") return false;

    // Remove any spaces or special characters and check if all remaining characters are digits
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, "");

    // Check if the cleaned phone contains only digits
    return /^\d+$/.test(cleanPhone) && cleanPhone.length >= 10;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);

    // Basic required field validation
    if (
      !form.fullName ||
      !form.email ||
      !form.phone ||
      !form.dob ||
      !form.gender ||
      !form.provinceId ||
      !form.wardId ||
      !form.departmentId ||
      !form.positionId
    ) {
      notifyError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    // Age validation
    if (!validateAge(form.dob)) {
      notifyError("Nhân viên phải từ 18 tuổi trở lên");
      return;
    }

    // Phone number validation
    if (!validatePhoneNumber(form.phone)) {
      notifyError(
        "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại chỉ chứa các chữ số và có ít nhất 10 số"
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const _ = await post("/api/employees", JSON.stringify(form));
      notifySuccess("Thêm nhân viên thành công");
      router.push("/");
    } catch (error) {
      console.error("Lỗi khi thêm nhân viên:", error);
      notifyError("Không thể thêm nhân viên. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout activePath="/">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Thêm Nhân Viên Mới</h1>
        <p className="text-gray-700">Điền thông tin để thêm nhân viên mới</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TextInput
              label="Họ và Tên"
              placeholder="Nhập họ và tên đầy đủ"
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              required
            />{" "}
            <DateInput
              label="Ngày Sinh"
              placeholder="Chọn ngày sinh"
              value={form.dob ? new Date(form.dob) : null}
              onChange={(date) =>
                setForm({ ...form, dob: date ? date.toString() : "" })
              }
              error={
                form.dob && !validateAge(form.dob)
                  ? "Nhân viên phải từ 18 tuổi trở lên"
                  : undefined
              }
              maxDate={new Date()}
              required
            />
            <Select
              label="Giới Tính"
              placeholder="Chọn giới tính"
              data={[
                { value: "Male", label: "Nam" },
                { value: "Female", label: "Nữ" },
              ]}
              value={form.gender}
              onChange={(value) => setForm({ ...form, gender: value || "" })}
              required
            />
            <TextInput
              label="Email"
              placeholder="Nhập địa chỉ email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />{" "}
            <div className="col-span-2 grid grid-cols-2 gap-6">
              <div className="grid-cols-1">
                <TextInput
                  label="Số Điện Thoại"
                  placeholder="Nhập số điện thoại"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  error={
                    form.phone && !validatePhoneNumber(form.phone)
                      ? "Số điện thoại chỉ được chứa các chữ số và có ít nhất 10 số"
                      : undefined
                  }
                  required
                />
              </div>

              <div></div>
            </div>
            <Select
              label="Tỉnh"
              placeholder="Tỉnh"
              data={provinceOptions}
              value={form.provinceId}
              onChange={(value) =>
                setForm({ ...form, provinceId: value || "" })
              }
              searchable
              required
            />
            <Select
              label="Thành phố/Huyện"
              placeholder="Thành phố/Huyện"
              data={wardOptions}
              value={form.wardId}
              onChange={(value) => setForm({ ...form, wardId: value || "" })}
              searchable
              required
            />
            <Select
              label="Phòng Ban"
              placeholder="Chọn phòng ban"
              data={departmentOptions}
              value={form.departmentId}
              onChange={(value) =>
                setForm({ ...form, departmentId: value || "" })
              }
              searchable
              required
            />
            <Select
              label="Chức Vụ"
              placeholder="Chọn chức vụ"
              data={positionOptions}
              value={form.positionId}
              onChange={(value) =>
                setForm({ ...form, positionId: value || "" })
              }
              searchable
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button type="submit" loading={isSubmitting}>
              Thêm Nhân Viên
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}
