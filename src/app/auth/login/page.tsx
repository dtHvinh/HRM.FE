'use client';

import { setAuth } from '@/context/AuthProvider';
import { post } from '@/util/api';
import { Alert, Button, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            username: '',
            password: '',
        },
        validate: {
            username: (value) => (value.length < 3 ? 'Username must be at least 3 characters' : null),
            password: (value) => (value.length < 3 ? 'Password must be at least 5 characters' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            setError('');
            setLoading(true);

            const response: { accessToken: string } = await post('/api/auth/login', JSON.stringify(values));

            setAuth(response.accessToken);
            router.push('/');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-[420px] mx-auto my-10">
            <h1 className="text-2xl font-bold text-center mb-6">
                Welcome to HRM System
            </h1>

            <p className="text-sm text-gray-500 text-center mb-8">
                Sign in to access your account
            </p>

            <div className="bg-white border rounded-lg shadow-sm p-8 mt-8">
                {error && (
                    <Alert color="red" mb="md" title="Authentication Error" variant="light">
                        {error}
                    </Alert>
                )}

                <form onSubmit={form.onSubmit(handleSubmit)}>
                    <TextInput
                        label="Username"
                        required
                        {...form.getInputProps('username')}
                    />

                    <PasswordInput
                        label="Password"
                        required
                        className="mt-4"
                        {...form.getInputProps('password')}
                    />

                    <Button fullWidth className="mt-6" type="submit" loading={loading}>
                        Sign in
                    </Button>
                </form>
            </div>
        </div>
    );
}