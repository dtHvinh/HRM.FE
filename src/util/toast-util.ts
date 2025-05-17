import { toast } from "sonner";

export function notifyError(message: string) {
    toast.error(message, {
        position: 'top-center',
        style: {
            color: 'red',
        }
    });
}

export function notifySuccess(message: string) {
    toast.success(message, {
        position: 'top-center',
        style: {
            color: 'green',
        }
    });
}