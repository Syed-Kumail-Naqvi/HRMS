import React, { useState } from 'react';
import CompanyManagement from './SuperAdmin/CompanyManagement'; 

/**
 * Props for SuperAdminDashboard component.
 * @param token - The authentication token for API calls.
 */
interface SuperAdminDashboardProps {
  token: string; // SuperAdminDashboard now needs the token to pass to sub-components
}

/**
 * SuperAdminDashboard Component
 * This component will house the specific functionalities and UI for the Super Admin role.
 * For now, it contains placeholders for the main sections a Super Admin would manage.
 * Styled with Tailwind CSS.
 */
const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ token }) => {
  // State to manage which section is currently active/visible
  const [activeSection, setActiveSection] = useState<'overview' | 'companies' | 'users' | 'settings' | 'auditLogs'>('overview');

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg border border-gray-600">
            <h3 className="text-2xl font-semibold text-indigo-300 mb-4">Super Admin Overview</h3>
            <p className="text-gray-300">
              Welcome, Super Admin! Use the navigation on the left to manage different aspects of the system.
            </p>
            <p className="mt-2 text-gray-400">
              Select a section to begin.
            </p>
          </div>
        );
      case 'companies':
        return <CompanyManagement token={token} />; // Render CompanyManagement and pass the token
      case 'users':
        return (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-white mb-4">User Management</h3>
            <p className="text-gray-300">Content for User Management will go here.</p>
          </div>
        );
      case 'settings':
        return (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-white mb-4">System Configuration</h3>
            <p className="text-gray-300">Content for System Configuration will go here.</p>
          </div>
        );
      case 'auditLogs':
        return (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-white mb-4">Audit Logs</h3>
            <p className="text-gray-300">Content for Audit Logs will go here.</p>
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
            activeSection === 'overview' ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveSection('companies')}
          className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${
            activeSection === 'companies' ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Company Management
        </button>
        <button
          onClick={() => setActiveSection('users')}
          className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${
            activeSection === 'users' ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => setActiveSection('settings')}
          className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${
            activeSection === 'settings' ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          System Configuration
        </button>
        <button
          onClick={() => setActiveSection('auditLogs')}
          className={`w-full text-left py-2 px-4 rounded-lg transition duration-200 ${
            activeSection === 'auditLogs' ? 'bg-indigo-700 text-white' : 'text-gray-300 hover:bg-gray-700'
          }`}
        >
          Audit Logs
        </button>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 p-4 md:p-6 bg-gray-900">
        {renderSection()}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;