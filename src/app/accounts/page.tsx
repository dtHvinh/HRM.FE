'use client'

import MainLayout from '@/components/layout/MainLayout';
import { fetcher, post, put } from '@/util/api';
import { notifyError } from '@/util/toast-util';
import { PasswordInput, TextInput } from '@mantine/core';
import { Check, Plus, X } from 'lucide-react';
import { useState } from 'react';
import useSWR from 'swr';

type Account = {
    accountId: number;
    username: string;
    password?: string;
};

type AccountFormData = {
    username: string;
    password: string;
};

export default function AccountsPage() {
    const { data: accounts, error, mutate } = useSWR<Account[]>('/api/accounts', fetcher);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [editingAccountId, setEditingAccountId] = useState<number | null>(null);

    const [editFormData, setEditFormData] = useState<AccountFormData>({
        username: '',
        password: ''
    });

    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const isLoading = !accounts && !error;

    const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCreateAccount = async () => {
        const createdAccount: Account = {
            accountId: accounts ? Math.max(...accounts.map(a => a.accountId), 0) + 1 : 1,
            username: newUsername,
            password: newPassword
        };

        try {
            await post('/api/accounts', JSON.stringify(createdAccount));
            mutate(accounts ? [...accounts, createdAccount] : [createdAccount], false);
            setNewUsername('');
            setNewPassword('');
            setIsAddingNew(false);
        }
        catch {
            notifyError('Không thể tạo tài khoản')
        }
    };

    const handleCancelAdd = () => {
        setNewUsername('');
        setNewPassword('');
        setIsAddingNew(false);
    };

    const startEditingAccount = (account: Account) => {
        setEditingAccountId(account.accountId);
        setEditFormData({
            username: account.username,
            password: ''
        });
    };

    const handleSaveEdit = async () => {
        if (!editingAccountId) return;

        const updatedAccounts = accounts?.map(account =>
            account.accountId === editingAccountId ? {
                ...account,
                username: account.username,
                password: editFormData.password || account.password
            } : account
        );

        try {
            await put(`/api/accounts/${editingAccountId}`, JSON.stringify(editFormData));
            mutate(updatedAccounts, false);

            setEditingAccountId(null);
            setEditFormData({
                username: '',
                password: ''
            });
        }
        catch {
            notifyError('Failed to update account')
        }
    };

    const handleCancelEdit = () => {
        setEditingAccountId(null);
        setEditFormData({
            username: '',
            password: ''
        });
    };

    const handleDeleteAccount = async () => {
        if (!selectedAccount) return;

        const filteredAccounts = accounts?.filter(account => account.accountId !== selectedAccount.accountId);
        mutate(filteredAccounts, false);

        setSelectedAccount(null);
        setShowDeleteModal(false);
    };

    const openDeleteModal = (account: Account) => {
        setSelectedAccount(account);
        setShowDeleteModal(true);
    };

    return (
        <MainLayout activePath="/accounts">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Tài Khoản</h1>
                    <p className="text-gray-600">Quản lý tài khoản người dùng và phân quyền</p>
                </div>
                <button
                    onClick={() => {
                        setNewUsername('');
                        setNewPassword('');
                        setIsAddingNew(true);
                    }}
                    className="text-black px-2 py-2 rounded-full hover:bg-gray-100"
                    disabled={isAddingNew || editingAccountId !== null}
                    title="Thêm tài khoản"
                >
                    <Plus />
                </button>
            </div>

            {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm p-6 flex justify-center items-center h-64">
                    <p className="text-gray-500">Đang tải danh sách tài khoản...</p>
                </div>
            ) : error ? (
                <div className="bg-white rounded-lg shadow-sm p-6 flex justify-center items-center h-64">
                    <p className="text-red-500">Lỗi khi tải danh sách tài khoản. Vui lòng thử lại.</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tên Đăng Nhập</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mật Khẩu</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao Tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {accounts?.map((account) => (
                                    <tr key={account.accountId} className={`hover:bg-gray-50 [&_td]:px-6 [&_td]:py-4 ${editingAccountId === account.accountId ? 'bg-blue-50' : ''}`}>
                                        <td className="whitespace-nowrap text-sm font-medium text-gray-900">{account.username}</td>
                                        <td className=''>
                                            {editingAccountId === account.accountId ? (
                                                <TextInput
                                                    name="password"
                                                    value={editFormData.password}
                                                    onChange={handleEditInputChange}
                                                    placeholder="Nhập mật khẩu mới"
                                                    type="password"
                                                    variant="filled"
                                                    required
                                                    autoFocus
                                                />
                                            ) : (
                                                <PasswordInput
                                                    variant='unstyled'
                                                    readOnly
                                                    value={account.password}
                                                />
                                            )}
                                        </td>
                                        <td className="whitespace-nowrap text-right text-sm font-medium">
                                            {editingAccountId === account.accountId ? (
                                                <>
                                                    <button
                                                        onClick={handleSaveEdit}
                                                        disabled={!editFormData.password}
                                                        className="text-green-600 hover:text-green-900 mr-2 p-1 rounded-full hover:bg-green-100"
                                                        title="Lưu"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                                        title="Hủy"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    <button
                                                        onClick={() => startEditingAccount(account)}
                                                        className="text-blue-600 hover:text-blue-900 mr-4"
                                                        disabled={isAddingNew || editingAccountId !== null}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteModal(account)}
                                                        className="text-red-600 hover:text-red-900"
                                                        disabled={isAddingNew || editingAccountId !== null}
                                                    >
                                                        Xóa
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {isAddingNew && (
                                    <tr className="bg-blue-50 [&_td]:px-6 [&_td]:py-4">
                                        <td>
                                            <TextInput
                                                value={newUsername}
                                                onChange={(e) => setNewUsername(e.currentTarget.value)}
                                                placeholder="Nhập tên đăng nhập"
                                                variant="filled"
                                                required
                                                autoFocus
                                            />
                                        </td>
                                        <td>
                                            <TextInput
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.currentTarget.value)}
                                                placeholder="Nhập mật khẩu"
                                                type="password"
                                                variant="filled"
                                                required
                                            />
                                        </td>
                                        <td className="whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={handleCreateAccount}
                                                disabled={!newUsername || !newPassword}
                                                className="text-green-600 hover:text-green-900 mr-2 p-1 rounded-full hover:bg-green-100"
                                                title="Tạo"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={handleCancelAdd}
                                                className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100"
                                                title="Hủy"
                                            >
                                                <X size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            <div className="modal">
                {showDeleteModal && (
                    <div className="modal-content">
                        <div className="p-2">
                            <p className="mb-4">Bạn có chắc chắn muốn xóa tài khoản <strong>{selectedAccount?.username}</strong>? Hành động này không thể hoàn tác.</p>
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Hủy
                                </button>
                                <button
                                    onClick={handleDeleteAccount}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                                >
                                    Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}