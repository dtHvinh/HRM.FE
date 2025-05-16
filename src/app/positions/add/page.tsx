'use client';

import MainLayout from '@/components/layout/MainLayout';
import { post } from '@/util/api';
import { notifyError } from '@/util/toast-util';
import { Button, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddPositionPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm({
        initialValues: {
            name: '',
        },

        validate: {
            name: (value) => (value.length < 2 ? 'Position name must have at least 2 letters' : null),
        },
    });

    const handleSubmit = form.onSubmit(async (values) => {
        setIsSubmitting(true);
        try {
            await post('/api/positions', JSON.stringify({ name: values.name.trim() }));
            router.push('/positions');
        } catch (error) {
            notifyError('Failed to add position');
            setIsSubmitting(false);
        }
    });

    return (
        <MainLayout activePath="/positions">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link
                        href="/positions"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold">Add New Position</h1>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <TextInput
                                label="Position Name"
                                placeholder="Enter position name (e.g., Software Engineer)"
                                description="Enter the official job position title"
                                {...form.getInputProps('name')}
                                required
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Link href="/positions">
                                <Button variant="outline" color="gray">Cancel</Button>
                            </Link>
                            <button
                                type="submit"
                                className='bg-blue-600 px-4 py-2 rounded-md text-white hover:bg-blue-700 transition-colors'
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Adding...' : 'Add Position'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </MainLayout>
    );
}