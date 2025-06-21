'use client';

import { GetEmployeeDTO } from '@/app/page';
import { fetcher } from '@/util/api';
import { printContent } from '@/util/helper';
import { Button } from '@mantine/core';
import { Printer } from 'lucide-react';
import { useEffect, useRef } from 'react';
import useSWR from 'swr';

interface EmployeeReportProps {
  onClose: () => void;
  employeeId: number;
}

type EmployeeReport = GetEmployeeDTO & {
  salaryCoefficient: number;
  allowanceCoefficient: number;
  insuranceCoefficient: number;
  salaryRaiseDay: string;
};

const EmployeeReport = ({ employeeId, onClose }: EmployeeReportProps) => {
  const reportRef = useRef<HTMLDivElement>(null);
  const { data: employee } = useSWR<EmployeeReport>(
    `/api/employees/${employeeId}/report`, fetcher);

  useEffect(() => {
    // Add print-specific styles when component mounts
    const style = document.createElement('style');
    style.id = 'print-style';
    style.innerHTML = `
      @media print {
        body * {
          visibility: visible !important;
        }
        #print-report {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          visibility: visible !important;
        }
        #print-report * {
          visibility: visible !important;
        }
        .no-print {
          display: none !important;
        }
        @page {
          size: A4;
          margin: 15mm;
        }
      }
    `;
    document.head.appendChild(style);

    return () => {
      const printStyle = document.getElementById('print-style');
      if (printStyle) {
        document.head.removeChild(printStyle);
      }
    };
  }, [onClose]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const getCurrentDate = () => {
    const now = new Date();
    return `Ngày ${now.getDate()} tháng ${now.getMonth() + 1} năm ${now.getFullYear()}`;
  };

  return (
    <>
      <div className="flex justify-end">
        <Button
          leftSection={<Printer size={16} />}
          onClick={() => {
            const content = reportRef.current?.innerHTML ?? "";
            printContent(content);
          }}
          variant="light"
        >
          In báo cáo
        </Button>
      </div>

      {employee &&
        <div id="print-report" ref={reportRef} className="bg-white font-sans scale-75">
          <div className="flex justify-between mb-8">
            <div className="text-center">
              <p className="font-bold uppercase mb-1">ĐÀI PT-TH AN GIANG</p>
              <div className="w-16 h-0.5 bg-black mx-auto mb-1"></div>
            </div>
            <div className="text-center">
              <p className="font-bold uppercase mb-1">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p className="mb-1">Độc lập - Tự do - Hạnh phúc</p>
              <div className="w-32 h-0.5 bg-black mx-auto mb-1"></div>
            </div>
          </div>

          <div className="flex justify-between mb-6">
            <div>
              <p></p>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-xl font-bold uppercase">BÁO CÁO THÔNG TIN NHÂN VIÊN</h1>
          </div>

          <div className="mb-6">
            <p className="text-center">Kính gửi: ................................................</p>
          </div>

          <div className="mb-6">
            <h2 className="font-bold mb-2">1. THÔNG TIN VỀ NHÂN VIÊN</h2>
            <p className="ml-4 mb-1">1. Tên nhân viên: {employee.fullName}</p>
            <p className="ml-4 mb-1">2. Ngày sinh: {formatDate(employee.dob)}</p>
            <p className="ml-4 mb-1">3. Giới tính: {employee.gender === 'Male' ? 'Nam' : employee.gender === 'Female' ? 'Nữ' : employee.gender}</p>
            <p className="ml-4 mb-1">4. Email: {employee.email}</p>
            <p className="ml-4 mb-1">5. Số điện thoại: {employee.phone}</p>
          </div>

          <div className="mb-6">
            <h2 className="font-bold mb-2">2. THÔNG TIN CÔNG VIỆC</h2>
            <p className="ml-4 mb-1">1. Phòng ban: {employee.department}</p>
            <p className="ml-4 mb-1">2. Chức vụ: {employee.position}</p>
          </div>

          <div className="mb-6">
            <h2 className="font-bold mb-2">3. THÔNG TIN LƯƠNG VÀ PHỤ CẤP</h2>
            <p className="ml-4 mb-1">1. Hệ số lương: {employee.salaryCoefficient} - Ngày nâng lương: {formatDate(employee.salaryRaiseDay)}</p>
            <p className="ml-4 mb-1">2. Hệ số bảo hiểm: {employee.insuranceCoefficient}</p>
            <p className="ml-4 mb-1">3. Hệ số phụ cấp: {employee.allowanceCoefficient}</p>
          </div>

          <div className="flex justify-end mt-12">
            <div className="text-center w-64">
              <div>
                <p>{getCurrentDate()}</p>
              </div>
              <p className="font-bold">NGƯỜI LẬP BÁO CÁO</p>
              <p className="italic">(Ký, ghi rõ họ tên)</p>
              <div className="h-20"></div>
            </div>
          </div>
        </div>
      }
    </>
  );
};

export default EmployeeReport;