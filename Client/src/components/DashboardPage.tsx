// src/components/DashboardPage.tsx
import React from 'react';

/**
 * Interface for User data.
 */
interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  company?: string; // Optional, as superadmin might not have a company
}

/**
 * Props for DashboardPage component.
 * @param onLogout - Callback function for logging out.
 * @param user - The authenticated user's data.
 */
interface DashboardPageProps {
  onLogout: () => void;
  user: UserData | null; // User data will be passed here
}

/**
 * DashboardPage Component
 * Provides a more structured and professional dashboard layout.
 * It displays a header with user info and a logout button,
 * and conditionally renders content based on the user's role.
 * Styled with Tailwind CSS for responsiveness and a modern look.
 */
const DashboardPage: React.FC<DashboardPageProps> = ({ onLogout, user }) => {
  // Ensure user data is available before rendering
  if (!user) {
    // This case should ideally be handled by App.tsx redirecting to login,
    // but a fallback is good practice.
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        User data not available. Please log in.
      </div>
    );
  }

  // Determine dashboard content based on user role
  const renderDashboardContent = () => {
    switch (user.role) {
      case 'superadmin':
        return (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-indigo-300 mb-4">Super Admin Dashboard</h3>
            <p className="text-gray-300">
              Welcome, Super Admin! From here, you can manage companies, users, and system configurations.
            </p>
            <p className="mt-2 text-gray-400">
              (e.g., Link to Company Management, User Management, System Settings, Audit Logs)
            </p>
          </div>
        );
      case 'companyadmin':
        return (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-green-300 mb-4">Company Admin Dashboard</h3>
            <p className="text-gray-300">
              Welcome, Company Admin! Manage your company's departments, designations, employees, attendance, and leaves.
            </p>
            <p className="mt-2 text-gray-400">
              (e.g., Link to Employee Management, Leave Approvals, Department/Designation Setup)
            </p>
          </div>
        );
      case 'servicemanager':
        return (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-yellow-300 mb-4">Service Manager Dashboard</h3>
            <p className="text-gray-300">
              Welcome, Service Manager! Oversee your teams, tasks, and employee performance.
            </p>
            <p className="mt-2 text-gray-400">
              (e.g., Link to Team Management, Task Assignments, Performance Reviews)
            </p>
          </div>
        );
      case 'employee':
        return (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
            <h3 className="text-2xl font-semibold text-blue-300 mb-4">Employee Dashboard</h3>
            <p className="text-gray-300">
              Welcome, Employee! Access your profile, attendance, leave requests, payrolls, and tasks.
            </p>
            <p className="mt-2 text-gray-400">
              (e.g., Link to My Profile, Apply for Leave, View Payslips, Clock In/Out)
            </p>
          </div>
        );
      default:
        return (
          <div className="p-6 bg-gray-700 rounded-lg shadow-lg">
            <h3 className="2xl font-semibold text-red-300 mb-4">Unknown Role</h3>
            <p className="text-gray-300">
              Your role is not recognized. Please contact support.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-800 shadow-md p-4 md:p-6 flex flex-col md:flex-row justify-between items-center border-b border-gray-700">
        <div className="text-2xl font-bold text-white mb-4 md:mb-0">
          HRMS Dashboard
        </div>
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          <span className="text-gray-300 text-lg">
            Hello, <span className="font-semibold text-white">{user.name}</span>!
          </span>
          <span className="text-gray-400 text-md capitalize">
            Role: {user.role}
          </span>
          <button
            onClick={onLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 md:p-8 flex items-center justify-center">
        {renderDashboardContent()}
      </main>

      {/* Footer (Optional) */}
      <footer className="bg-gray-800 p-4 text-center text-gray-500 text-sm border-t border-gray-700">
        &copy; {new Date().getFullYear()} HRMS System. All rights reserved.
      </footer>
    </div>
  );
};

export default DashboardPage;