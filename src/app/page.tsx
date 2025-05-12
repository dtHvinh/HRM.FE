import MainLayout from '@/components/layout/MainLayout';

export default function Dashboard() {
  return (
    <MainLayout activePath="/">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-700">Welcome to your HR Management System</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Staff Overview</h2>
            <span className="p-2 bg-blue-50 rounded-full text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">124</p>
              <p className="text-gray-700">Total Employees</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">+4%</p>
              <p className="text-gray-700 text-sm">From last month</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-700 text-sm">Active</p>
              <p className="font-semibold">118</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md">
              <p className="text-gray-700 text-sm">On Leave</p>
              <p className="font-semibold">6</p>
            </div>
          </div>
        </div>

        {/* Departments Card */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Departments</h2>
            <span className="p-2 bg-purple-50 rounded-full text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
                <path d="M13 5v2" />
                <path d="M13 17v2" />
                <path d="M13 11v2" />
              </svg>
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold">8</p>
              <p className="text-gray-700">Total Departments</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm">Engineering</p>
              <p className="text-sm font-medium">42 employees</p>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm">Marketing</p>
              <p className="text-sm font-medium">18 employees</p>
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm">HR</p>
              <p className="text-sm font-medium">12 employees</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Latest Notifications</h2>
            <span className="p-2 bg-amber-50 rounded-full text-amber-600">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
            </span>
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-3 py-1">
              <p className="font-medium">Salary Review</p>
              <p className="text-sm text-gray-700">Quarterly salary review for Engineering team</p>
              <p className="text-xs text-gray-600 mt-1">Today, 9:30 AM</p>
            </div>
            <div className="border-l-4 border-green-500 pl-3 py-1">
              <p className="font-medium">New Employee</p>
              <p className="text-sm text-gray-700">Sarah Johnson joined Marketing department</p>
              <p className="text-xs text-gray-600 mt-1">Yesterday, 2:15 PM</p>
            </div>
            <div className="border-l-4 border-amber-500 pl-3 py-1">
              <p className="font-medium">Department Meeting</p>
              <p className="text-sm text-gray-700">HR department monthly meeting</p>
              <p className="text-xs text-gray-600 mt-1">Mar 15, 10:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
