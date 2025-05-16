import { getAuth } from "@/context/AuthProvider";
import axios, { AxiosRequestConfig } from "axios";

export const baseURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const api = axios.create({ baseURL });

export async function fetcher<T = any>(url: string): Promise<T> {
    const response = await api.get<T>(url, {
        headers: {
            'Authorization': 'Bearer ' + getAuth()
        }
    });
    return response.data;
}

export async function get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.get<T>(url, {
        ...config,
        headers: {
            'Authorization': 'Bearer ' + getAuth()
        }
    });
    return response.data;
}

export async function post<T = any>(url: string, data?: any): Promise<T> {
    const response = await api.post<T>(url, data, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + getAuth()
        }
    });
    return response.data;
}

export async function put<T = any>(url: string, data?: any): Promise<T> {
    const response = await api.put<T>(url, data, {
        headers: {
            "Content-Type": "application/json",
            'Authorization': 'Bearer ' + getAuth()
        }
    });
    return response.data;
}

export async function del<T = any>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await api.delete<T>(url, {
        ...config,
        headers: {
            'Authorization': 'Bearer ' + getAuth()
        }
    });
    return response.data;
}