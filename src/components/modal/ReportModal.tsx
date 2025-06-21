'use client';

import { Modal } from '@mantine/core';
import EmployeeReport from '../employee/EmployeeReport';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number;
}

const ReportModal = ({ isOpen, onClose, employeeId }: ReportModalProps) => {

  return (
    <Modal
      opened={isOpen}
      onClose={onClose}
      size="50%"
      title="Bản xem trước"
      centered
    >
      <EmployeeReport employeeId={employeeId} onClose={onClose} />
    </Modal>
  );
};

export default ReportModal;