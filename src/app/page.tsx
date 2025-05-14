import MainLayout from '@/components/layout/MainLayout';
import Link from 'next/link';

const employeesData = [
    {
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
    },
    {
        id: 2,
        fullName: 'Jane Smith',
        dateOfBirth: '1990-08-22',
        gender: 'Female',
        province: 'California',
        ward: 'Downtown LA',
        address: '456 Oak Ave, Los Angeles, CA',
        email: 'jane.smith@example.com',
        phone: '(555) 987-6543',
        department: 'Marketing',
    },
    {
        id: 3,
        fullName: 'Michael Brown',
        dateOfBirth: '1988-03-10',
        gender: 'Male',
        province: 'Illinois',
        ward: 'Loop',
        address: '789 Pine St, Chicago, IL',
        email: 'michael.brown@example.com',
        phone: '(555) 456-7890',
        department: 'Engineering',
    },
    {
        id: 4,
        fullName: 'Emily Davis',
        dateOfBirth: '1992-11-28',
        gender: 'Female',
        province: 'Massachusetts',
        ward: 'Back Bay',
        address: '321 Elm St, Boston, MA',
        email: 'emily.davis@example.com',
        phone: '(555) 234-5678',
        department: 'Marketing',
    },
    {
        id: 5,
        fullName: 'David Wilson',
        dateOfBirth: '1983-07-14',
        gender: 'Male',
        province: 'Washington',
        ward: 'Capitol Hill',
        address: '654 Maple Ave, Seattle, WA',
        email: 'david.wilson@example.com',
        phone: '(555) 876-5432',
        department: 'Sales',
    },
    {
        id: 6,
        fullName: 'Sarah Johnson',
        dateOfBirth: '1995-02-18',
        gender: 'Female',
        province: 'Florida',
        ward: 'South Beach',
        address: '987 Beach Blvd, Miami, FL',
        email: 'sarah.johnson@example.com',
        phone: '(555) 345-6789',
        department: 'Marketing',
    },
];

export default function EmployeesPage() {
    const employees = employeesData;

    return (
        <MainLayout activePath="/">
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Employees</h1>
                    <p className="text-gray-700">Manage your employees</p>
                </div>
                <Link href="/employees/add" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 5v14" />
                        <path d="M5 12h14" />
                    </svg>
                    Add Employee
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="search" className="block text-sm font-medium text-gray-800 mb-1">Search</label>
                        <div className="relative">
                            <input
                                type="text"
                                id="search"
                                placeholder="Search employees..."
                                className="w-full py-2 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            >
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="department" className="block text-sm font-medium text-gray-800 mb-1">Department</label>
                        <select
                            id="department"
                            className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Departments</option>
                            <option value="Engineering">Engineering</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Sales">Sales</option>
                            <option value="HR">HR</option>
                        </select>
                    </div>
                    <div>
                        <label htmlFor="gender" className="block text-sm font-medium text-gray-800 mb-1">Gender</label>
                        <select
                            id="gender"
                            className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Genders</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Employees Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Full Name</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Date of Birth</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Gender</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Province</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Ward</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Email</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Department</th>
                                <th className="py-3 px-4 text-left text-sm font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {employees.map((employee) => (
                                <tr key={employee.id} className="hover:bg-gray-50">
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                                {employee.fullName.split(' ').map(name => name[0]).join('')}
                                            </div>
                                            <div>
                                                <Link href={`/employees/${employee.id}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                                                    {employee.fullName}
                                                </Link>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        {new Date(employee.dateOfBirth).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        {employee.gender}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        {employee.province}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        {employee.ward}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        {employee.email}
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            {employee.department}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-700">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/employees/${employee.id}`} className="text-blue-600 hover:text-blue-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                                    <circle cx="12" cy="12" r="3" />
                                                </svg>
                                            </Link>
                                            <button className="text-gray-600 hover:text-gray-900">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                                                </svg>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gray-50 px-4 py-3 flex items-center justify-between">
                    <div className="flex-1 flex justify-between sm:hidden">
                        <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Previous
                        </button>
                        <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                            <p className="text-sm text-gray-800">
                                Showing <span className="font-medium">1</span> to <span className="font-medium">6</span> of{' '}
                                <span className="font-medium">6</span> results
                            </p>
                        </div>
                        <div>
                            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span className="sr-only">Previous</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m15 18-6-6 6-6" />
                                    </svg>
                                </button>
                                <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    1
                                </button>
                                <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <span className="sr-only">Next</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m9 18 6-6-6-6" />
                                    </svg>
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}