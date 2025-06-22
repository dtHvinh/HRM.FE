import { GetEmployeeDTO } from "@/app/page";
import { printContent } from "@/util/helper";
import { notifyError } from "@/util/toast-util";

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN");
};

export const getCurrentDate = () => {
  const now = new Date();
  return `Ngày ${now.getDate()} tháng ${
    now.getMonth() + 1
  } năm ${now.getFullYear()}`;
};

export const handlePrintAllEmployees = (
  employees: GetEmployeeDTO[] | undefined
) => {
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
