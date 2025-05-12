'use client';

import { Alert, Button, Divider, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        },
        validate: {
            email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
        },
    });

    const handleSubmit = async (values: typeof form.values) => {
        try {
            setError('');
            setLoading(true);

            // In a real application, you would call your authentication API here
            console.log('Login attempt with:', values);

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // For demo purposes, redirect to dashboard
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
                        label="Email"
                        placeholder="your@email.com"
                        required
                        {...form.getInputProps('email')}
                    />

                    <PasswordInput
                        label="Password"
                        placeholder="Your password"
                        required
                        className="mt-4"
                        {...form.getInputProps('password')}
                    />

                    <Button fullWidth className="mt-6" type="submit" loading={loading}>
                        Sign in
                    </Button>
                </form>

                <Divider label="Or" labelPosition="center" className="my-6" />

                <div className="text-center mt-4">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}