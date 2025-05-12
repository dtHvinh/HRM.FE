import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';

// This would typically come from an API based on the ID
const employeeData = {
    id: 1,
    fullName: 'John Doe',
    dateOfBirth: '1985-05-15',
    gender: 'Male',
    province: 'New York',
    ward: 'Manhattan',
    address: '123 Main St, New York, NY',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    department: 'Engineering',
    position: 'Senior Developer',
    joinDate: '2018-03-15',
    manager: 'Sarah Johnson',
    bio: 'John is an experienced developer with expertise in React, Node.js, and cloud technologies. He has been with the company for over 5 years and has contributed to several key projects.',
    departmentHistory: [
        {
            department: 'Engineering',
            position: 'Senior Developer',
            startDate: '2021-06-01',
            endDate: null,
        },
        {
            department: 'Engineering',
            position: 'Developer',
            startDate: '2018-03-15',
            endDate: '2021-05-31',
        },
        {
            department: 'IT Support',
            position: 'Technical Support Specialist',
            startDate: '2016-08-10',
            endDate: '2018-03-14',
        },
    ],
};

export default function EmployeeDetailPage({ params }: { params: { id: string } }) {
    // In a real application, this would fetch data based on the ID
    const employee = employeeData;

    return (
        <MainLayout activePath="/employees">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-2">
                    <Link
                        href="/employees"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold">{employee.fullName}</h1>
                </div>
                <div className="flex gap-2">
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                        </svg>
                        Edit
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex items-start">
                            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-4 text-xl font-bold">
                                {employee.fullName.split(' ').map(name => name[0]).join('')}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{employee.fullName}</h2>
                                <p className="text-gray-700">{employee.position} • {employee.department}</p>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Personal Information</h3>
                                <div className="mt-2 space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-700">Date of Birth</p>
                                        <p className="text-sm">{new Date(employee.dateOfBirth).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-700">Gender</p>
                                        <p className="text-sm">{employee.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-700">Province</p>
                                        <p className="text-sm">{employee.province}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-700">Ward</p>
                                        <p className="text-sm">{employee.ward}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-700">Address</p>
                                        <p className="text-sm">{employee.address}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-700">Contact Information</h3>
                                <div className="mt-2 space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-700">Email</p>
                                        <p className="text-sm">{employee.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-700">Phone</p>
                                        <p className="text-sm">{employee.phone}</p>
                                    </div>
                                </div>

                                <h3 className="text-sm font-medium text-gray-500 mt-4">Employment Information</h3>
                                <div className="mt-2 space-y-3">
                                    <div>
                                        <p className="text-xs text-gray-700">Join Date</p>
                                        <p className="text-sm">{new Date(employee.joinDate).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-700">Manager</p>
                                        <p className="text-sm">{employee.manager}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700">Bio</h3>
                            <p className="mt-2 text-sm text-gray-700">{employee.bio}</p>
                        </div>
                    </div>
                </div>

                {/* Department History Timeline */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-semibold mb-4">Department History</h2>
                        <div className="relative">
                            {/* Timeline line */}
                            <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                            {/* Timeline items */}
                            <div className="space-y-6">
                                {employee.departmentHistory.map((history, index) => (
                                    <div key={index} className="relative pl-10">
                                        {/* Timeline dot */}
                                        <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                                                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                                            </svg>
                                        </div>

                                        {/* Content */}
                                        <div>
                                            <h3 className="text-md font-medium">{history.department}</h3>
                                            <p className="text-sm text-gray-600">{history.position}</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {new Date(history.startDate).toLocaleDateString()} -
                                                {history.endDate ? new Date(history.endDate).toLocaleDateString() : 'Present'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}