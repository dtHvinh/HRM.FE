import { Tooltip } from "@mantine/core";
import { Check, Eye, Pen, Plus, Trash, X } from "lucide-react";

export default function ActionButton({ kind, onClick }: { kind: 'edit' | 'delete' | 'add' | 'check' | 'cancel', onClick: () => void }) {
    const getIcon = (kind: string) => {
        switch (kind) {
            case "edit":
                return <Pen size={16} className=" text-gray-600 cursor-pointer" />;
            case "delete":
                return <Trash size={16} className=" text-gray-600 cursor-pointer" />;
            case "add":
                return <Plus size={16} className=" text-gray-600 cursor-pointer" />;
            case "check":
                return <Check size={16} className=" text-gray-600 cursor-pointer" />;
            case "cancel":
                return <X size={16} className=" text-gray-600 cursor-pointer" />;
            case 'view':
                return <Eye size={16} className=" text-gray-600 cursor-pointer" />;
            default:
                return null;
        }
    }

    return (
        <Tooltip label={kind}>
            <button className="p-2 rounded-full" onClick={onClick}>
                {getIcon(kind)}
            </button>
        </Tooltip>
    )
}