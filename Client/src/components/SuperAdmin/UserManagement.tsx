// src/components/SuperAdmin/UserManagement.tsx
import React, { useState, useEffect } from 'react';

/**
 * Interface for User data.
 */
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'superadmin' | 'companyadmin' | 'servicemanager' | 'employee';
  company?: { _id: string; name: string }; // Company might be an object with _id and name
  status: number; // Assuming 1 for active, 2 for inactive
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for the payload when creating a new user.
 * This provides strong typing for the data sent to the backend.
 */
interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: 'superadmin' | 'companyadmin' | 'servicemanager' | 'employee';
  company?: string; // Company ID is a string, and optional for superadmin
}

/**
 * Props for UserManagement component.
 * @param token - The authentication token for API calls.
 */
interface UserManagementProps {
  token: string;
}

/**
 * UserManagement Component
 * Displays a list of all users and provides functionality to create new users.
 * This component will be used within the SuperAdminDashboard.
 * Styled with Tailwind CSS.
 */
const UserManagement: React.FC<UserManagementProps> = ({ token }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for new user form
  const [newName, setNewName] = useState<string>('');
  const [newEmail, setNewEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newRole, setNewRole] = useState<'superadmin' | 'companyadmin' | 'servicemanager' | 'employee'>('employee');
  const [newCompanyId, setNewCompanyId] = useState<string>(''); // For company-specific roles
  const [creatingUser, setCreatingUser] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  /**
   * Fetches the list of all users from the backend.
   */
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Authenticated request
          },
        });

        if (response.ok) {
          const data: User[] = await response.json();
          setUsers(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch users.');
        }
      } catch (err) {
        console.error('Network error fetching users:', err);
        setError('An unexpected error occurred while fetching users.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]); // Re-fetch if token changes

  /**
   * Handles the creation of a new user.
   * @param e - The form event object.
   */
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingUser(true);
    setCreateError(null);
    setCreateSuccess(null);

    // Basic client-side validation
    if (!newName || !newEmail || !newPassword || !newRole) {
      setCreateError('All required fields must be filled.');
      setCreatingUser(false);
      return;
    }
    if (['companyadmin', 'servicemanager', 'employee'].includes(newRole) && !newCompanyId) {
      setCreateError('Company ID is required for this role.');
      setCreatingUser(false);
      return;
    }

    try {
      // Using the new CreateUserPayload interface
      const payload: CreateUserPayload = { 
        name: newName,
        email: newEmail,
        password: newPassword,
        role: newRole,
      };
      if (newCompanyId && newRole !== 'superadmin') { // Only add company if not superadmin
        payload.company = newCompanyId;
      }

      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const newUser: User = await response.json();
        setUsers((prevUsers) => [...prevUsers, newUser]);
        setNewName('');
        setNewEmail('');
        setNewPassword('');
        setNewRole('employee'); // Reset to default
        setNewCompanyId('');
        setCreateSuccess('User created successfully!');
      } else {
        const errorData = await response.json();
        setCreateError(errorData.message || 'Failed to create user.');
      }
    } catch (err) {
      console.error('Network error creating user:', err);
      setCreateError('An unexpected error occurred while creating the user.');
    } finally {
      setCreatingUser(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-300">Loading users...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full">
      <h2 className="text-3xl font-bold text-indigo-400 mb-6 text-center">User Management</h2>

      {/* Create New User Form */}
      <div className="mb-8 p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
        <h3 className="text-xl font-semibold text-white mb-4">Create New User</h3>
        <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="userName" className="block text-gray-300 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="userName"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-600 placeholder-gray-400"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="userEmail" className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="userEmail"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-600 placeholder-gray-400"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="userPassword" className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="userPassword"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-600 placeholder-gray-400"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="userRole" className="block text-gray-300 text-sm font-bold mb-2">
              Role
            </label>
            <select
              id="userRole"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-600"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as User['role'])}
              required
            >
              <option value="employee">Employee</option>
              <option value="servicemanager">Service Manager</option>
              <option value="companyadmin">Company Admin</option>
              <option value="superadmin">Super Admin</option>
            </select>
          </div>
          {/* Company ID field, conditionally rendered for non-superadmin roles */}
          {newRole !== 'superadmin' && (
            <div>
              <label htmlFor="companyId" className="block text-gray-300 text-sm font-bold mb-2">
                Company ID (for non-Super Admin roles)
              </label>
              <input
                type="text"
                id="companyId"
                className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-600 placeholder-gray-400"
                placeholder="Enter Company ID"
                value={newCompanyId}
                onChange={(e) => setNewCompanyId(e.target.value)}
                // Fix for line 241: Explicitly check if the role is one that requires a company ID
                required={['companyadmin', 'servicemanager', 'employee'].includes(newRole)} 
              />
            </div>
          )}
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
              disabled={creatingUser}
            >
              {creatingUser ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
        {createError && <p className="text-red-400 text-sm mt-4 text-center">{createError}</p>}
        {createSuccess && <p className="text-green-400 text-sm mt-4 text-center">{createSuccess}</p>}
      </div>

      {/* Users List */}
      <div className="p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
        <h3 className="text-xl font-semibold text-white mb-4">Existing Users</h3>
        {users.length === 0 ? (
          <p className="text-gray-400 text-center">No users found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-600">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Company
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-700 divide-y divide-gray-600">
                {users.map((user) => (
                  <tr key={user._id || `temp-${Math.random()}`} className="hover:bg-gray-600 transition duration-150"> 
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300 capitalize">
                      {user.role}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {user.company?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-indigo-400 hover:text-indigo-300 mr-3">Edit</button>
                      <button className="text-red-400 hover:text-red-300">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;