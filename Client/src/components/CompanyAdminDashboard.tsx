// src/components/CompanyAdminDashboard.tsx
import React, { useState } from 'react';
import DepartmentManagement from './CompanyAdmin/DepartmentManagement';
import DesignationManagement from './CompanyAdmin/DesignationManagement';
import EmployeeManagement from './CompanyAdmin/EmployeeManagement'; // Import EmployeeManagement

/**
 * Props for CompanyAdminDashboard component.
 * @param token - The authentication token for API calls.
 * @param userCompanyId - The ID of the company this admin belongs to.
 * @param userCompanyName - The name of the company this admin belongs to.
 */
interface CompanyAdminDashboardProps {
  token: string;
  userCompanyId: string;
  userCompanyName: string;
}

/**
 * CompanyAdminDashboard Component
 * This component serves as the main dashboard for users with the 'companyadmin' role.
 * It provides navigation to manage various aspects specific to their company, such as
 * departments, designations, employees, attendance, and leaves.
 * Styled with Tailwind CSS for a clean and responsive layout.
 */
const CompanyAdminDashboard: React.FC<CompanyAdminDashboardProps> = ({ token, userCompanyId, userCompanyName }) => {
  // State to manage which section is currently active/visible within the dashboard
  const [activeSection, setActiveSection] = useState<'overview' | 'departments' | 'designations' | 'employees' | 'attendance' | 'leaves'>('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg border border-gray-600">
            <h3 className="text-2xl font-semibold text-green-300 mb-4">Company Admin Overview</h3>
            <p className="text-gray-300">
              Welcome, Company Admin of <span className="font-bold text-white">{userCompanyName}</span>!
            </p>
            <p className="mt-2 text-gray-400">
              Use the navigation on the left to manage your company's HR aspects.
            </p>
          </div>
        );
      case 'departments':
        return <DepartmentManagement token={token} userCompanyId={userCompanyId} />;
      case 'designations':
        return <DesignationManagement token={token} userCompanyId={userCompanyId} />;
      case 'employees':
        return <EmployeeManagement token={token} userCompanyId={userCompanyId} />; {/* Render EmployeeManagement */}
      case 'attendance':
        return (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-white mb-4">Attendance Management</h3>
            <p className="text-gray-300">Content for Attendance Management will go here.</p>
            <p className="text-gray-400 text-sm mt-2">
              (This section will allow you to track and manage employee attendance for {userCompanyName}).
            </p>
          </div>
        );
      case 'leaves':
        return (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-white mb-4">Leave Management</h3>
            <p className="text-gray-300">Content for Leave Management will go here.</p>
            <p className="text-gray-400 text-sm mt-2">
              (This section will allow you to approve/reject leave requests for employees of {userCompanyName}).
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-full w-full max-w-7xl mx-auto rounded-lg overflow-hidden bg-gray-900 border border-gray-700 shadow-2xl">
      {/* Sidebar Navigation */}
      <nav className="w-full md:w-64 bg-gray-800 p-4 md:p-6 border-b md:border-b-0 md:border-r border-gray-700 flex flex-row md:flex-col justify-center md:justify-start items-center md:items-stretch space-x-2 md:space-x-0 md:space-y-4 overflow-x-auto">
        <button
          onClick={() => setActiveSection('overview')}
          className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${
            activeSection === 'overview' ? 'bg-green-700 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveSection('departments')}
          className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${
            activeSection === 'departments' ? 'bg-green-700 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Department Management
        </button>
        <button
          onClick={() => setActiveSection('designations')}
          className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${
            activeSection === 'designations' ? 'bg-green-700 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Designation Management
        </button>
        <button
          onClick={() => setActiveSection('employees')}
          className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${
            activeSection === 'employees' ? 'bg-green-700 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Employee Management
        </button>
        <button
          onClick={() => setActiveSection('attendance')}
          className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${
            activeSection === 'attendance' ? 'bg-green-700 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Attendance Management
        </button>
        <button
          onClick={() => setActiveSection('leaves')}
          className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${
            activeSection === 'leaves' ? 'bg-green-700 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Leave Management
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 bg-gray-900">
        {renderSection()}
      </div>
    </div>
  );
};

export default CompanyAdminDashboard;