// src/components/CompanyAdmin/EmployeeManagement.tsx
import React, { useState, useEffect } from 'react';

/**
 * Interface for Employee data.
 * This should match the structure of employee objects returned by your backend.
 */
interface Employee {
  _id: string;
  user: { // Assuming user is populated and includes _id, name, email
    _id: string;
    name: string;
    email: string;
    status: number;
    role: string; // e.g., 'employee', 'servicemanager'
  };
  company: { _id: string; name: string }; // Company should be populated
  department: { _id: string; name: string }; // Department should be populated
  designation: { _id: string; name: string }; // Designation should be populated
  employeeId: string; // Custom employee ID
  hireDate: string;
  salary: number;
  contactNumber?: string;
  address?: string;
  status: number; // 1: Active, 2: Inactive
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for Department data (needed for dropdowns).
 */
interface Department {
  _id: string;
  name: string;
}

/**
 * Interface for Designation data (needed for dropdowns).
 */
interface Designation {
  _id: string;
  name: string;
}

/**
 * Props for EmployeeManagement component.
 * @param token - The authentication token for API calls.
 * @param userCompanyId - The ID of the company this admin belongs to.
 */
interface EmployeeManagementProps {
  token: string;
  userCompanyId: string;
}

/**
 * EmployeeManagement Component
 * Allows Company Admins to manage employees specific to their company.
 * Provides functionality to create, view, edit, and delete employees.
 * Styled with Tailwind CSS.
 */
const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ token, userCompanyId }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for new employee form
  const [newUserName, setNewUserName] = useState<string>('');
  const [newUserEmail, setNewUserEmail] = useState<string>('');
  const [newUserPassword, setNewUserPassword] = useState<string>('');
  const [newEmployeeId, setNewEmployeeId] = useState<string>('');
  const [newDepartment, setNewDepartment] = useState<string>(''); // Department ID
  const [newDesignation, setNewDesignation] = useState<string>(''); // Designation ID
  const [newHireDate, setNewHireDate] = useState<string>('');
  const [newSalary, setNewSalary] = useState<number>(0);
  const [newContactNumber, setNewContactNumber] = useState<string>('');
  const [newAddress, setNewAddress] = useState<string>('');
  const [creatingEmployee, setCreatingEmployee] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // State for editing employee
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [editUserName, setEditUserName] = useState<string>('');
  const [editUserEmail, setEditUserEmail] = useState<string>('');
  const [editEmployeeId, setEditEmployeeId] = useState<string>('');
  const [editDepartment, setEditDepartment] = useState<string>('');
  const [editDesignation, setEditDesignation] = useState<string>('');
  const [editHireDate, setEditHireDate] = useState<string>('');
  const [editSalary, setEditSalary] = useState<number>(0);
  const [editContactNumber, setEditContactNumber] = useState<string>('');
  const [editAddress, setEditAddress] = useState<string>('');
  const [editStatus, setEditStatus] = useState<number>(1);
  const [updatingEmployee, setUpdatingEmployee] = useState<boolean>(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);

  // State for custom alert/confirmation modal
  const [isCustomModalOpen, setIsCustomModalOpen] = useState<boolean>(false);
  const [customModalTitle, setCustomModalTitle] = useState<string>('');
  const [customModalMessage, setCustomModalMessage] = useState<string>('');
  const [customModalType, setCustomModalType] = useState<'alert' | 'confirm'>('alert');
  const [customModalOnConfirm, setCustomModalOnConfirm] = useState<(() => void) | null>(null);

  /**
   * Opens a custom alert modal.
   * @param title - The title of the alert.
   * @param message - The message content of the alert.
   */
  const openAlertDialog = (title: string, message: string) => {
    setCustomModalTitle(title);
    setCustomModalMessage(message);
    setCustomModalType('alert');
    setCustomModalOnConfirm(null); // No confirm action for alert
    setIsCustomModalOpen(true);
  };

  /**
   * Opens a custom confirmation modal.
   * @param title - The title of the confirmation.
   * @param message - The message content of the confirmation.
   * @param onConfirm - The function to call if the user confirms.
   */
  const openConfirmDialog = (title: string, message: string, onConfirm: () => void) => {
    setCustomModalTitle(title);
    setCustomModalMessage(message);
    setCustomModalType('confirm');
    setCustomModalOnConfirm(() => onConfirm); // Store the function to be called on confirm
    setIsCustomModalOpen(true);
  };

  /**
   * Closes the custom modal and resets its state.
   */
  const closeCustomModal = () => {
    setIsCustomModalOpen(false);
    setCustomModalTitle('');
    setCustomModalMessage('');
    setCustomModalType('alert');
    setCustomModalOnConfirm(null);
  };

  /**
   * Fetches the list of employees for the current company from the backend.
   */
  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5000/api/companies/${userCompanyId}/employees`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: Employee[] = await response.json();
        setEmployees(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch employees.');
      }
    } catch (err) {
      console.error('Network error fetching employees:', err);
      setError('An unexpected error occurred while fetching employees.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches departments and designations for dropdowns.
   */
  const fetchDependencies = async () => {
    try {
      const [departmentsRes, designationsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/companies/${userCompanyId}/departments`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch(`http://localhost:5000/api/companies/${userCompanyId}/designations`, {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
      ]);

      if (departmentsRes.ok) {
        const data = await departmentsRes.json();
        setDepartments(data);
      } else {
        console.error('Failed to fetch departments:', await departmentsRes.json());
      }
      if (designationsRes.ok) {
        const data = await designationsRes.json();
        setDesignations(data);
      } else {
        console.error('Failed to fetch designations:', await designationsRes.json());
      }
    } catch (err) {
      console.error('Error fetching dependencies:', err);
    }
  };


  useEffect(() => {
    if (userCompanyId) {
      fetchEmployees();
      fetchDependencies();
    }
  }, [token, userCompanyId]);

  /**
   * Handles the creation of a new employee.
   * @param e - The form event object.
   */
  const handleCreateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingEmployee(true);
    setCreateError(null);
    setCreateSuccess(null);

    if (!newUserName || !newUserEmail || !newUserPassword || !newEmployeeId || !newDepartment || !newDesignation || !newHireDate || newSalary <= 0) {
      setCreateError('Please fill all required fields.');
      setCreatingEmployee(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/companies/${userCompanyId}/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          employeeId: newEmployeeId,
          department: newDepartment,
          designation: newDesignation,
          hireDate: newHireDate,
          salary: newSalary,
          contactNumber: newContactNumber,
          address: newAddress,
          company: userCompanyId, // Ensure company ID is sent
          role: 'employee' // Default role for new employees created here
        }),
      });

      if (response.ok) {
        await fetchEmployees(); // Re-fetch employees to get the most up-to-date list
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewEmployeeId('');
        setNewDepartment('');
        setNewDesignation('');
        setNewHireDate('');
        setNewSalary(0);
        setNewContactNumber('');
        setNewAddress('');
        openAlertDialog('Success', 'Employee created successfully!'); // Use custom alert
      } else {
        const errorData = await response.json();
        openAlertDialog('Error', errorData.message || 'Failed to create employee.'); // Use custom alert
      }
    } catch (err) {
      console.error('Network error creating employee:', err);
      openAlertDialog('Error', 'An unexpected error occurred while creating the employee.'); // Use custom alert
    } finally {
      setCreatingEmployee(false);
    }
  };

  /**
   * Opens the edit modal and pre-fills the form with current employee data.
   * @param employee - The employee object to be edited.
   */
  const openEditModal = (employee: Employee) => {
    setCurrentEmployee(employee);
    setEditUserName(employee.user.name);
    setEditUserEmail(employee.user.email);
    setEditEmployeeId(employee.employeeId);
    setEditDepartment(employee.department._id);
    setEditDesignation(employee.designation._id);
    setEditHireDate(employee.hireDate.split('T')[0]); // Format date for input type="date"
    setEditSalary(employee.salary);
    setEditContactNumber(employee.contactNumber || '');
    setEditAddress(employee.address || '');
    setEditStatus(employee.status);
    setIsEditModalOpen(true);
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  /**
   * Closes the edit modal.
   */
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentEmployee(null);
  };

  /**
   * Handles the update of an existing employee.
   * @param e - The form event object.
   */
  const handleUpdateEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEmployee) return;

    setUpdatingEmployee(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const response = await fetch(`http://localhost:5000/api/employees/${currentEmployee._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editUserName,
          email: editUserEmail,
          employeeId: editEmployeeId,
          department: editDepartment,
          designation: editDesignation,
          hireDate: editHireDate,
          salary: editSalary,
          contactNumber: editContactNumber,
          address: editAddress,
          status: editStatus,
        }),
      });

      if (response.ok) {
        await fetchEmployees(); // Re-fetch all employees to ensure updated data is displayed
        openAlertDialog('Success', 'Employee updated successfully!'); // Use custom alert
        closeEditModal();
      } else {
        const errorData = await response.json();
        openAlertDialog('Error', errorData.message || 'Failed to update employee.'); // Use custom alert
      }
    } catch (err) {
      console.error('Network error updating employee:', err);
      openAlertDialog('Error', 'An unexpected error occurred while updating the employee.'); // Use custom alert
    } finally {
      setUpdatingEmployee(false);
    }
  };

  /**
   * Handles the deletion of an employee.
   * @param employeeId - The ID of the employee to delete.
   * @param employeeName - The name of the employee for confirmation.
   */
  const handleDeleteEmployee = async (employeeId: string, employeeName: string) => {
    // Use custom confirmation dialog instead of window.confirm
    openConfirmDialog(
      'Confirm Deletion',
      `Are you sure you want to delete employee "${employeeName}"? This will also delete the associated user account.`,
      async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setEmployees(employees.filter(emp => emp._id !== employeeId));
            openAlertDialog('Success', `Employee "${employeeName}" deleted successfully!`); // Use custom alert
          } else {
            const errorData = await response.json();
            openAlertDialog('Error', `Failed to delete employee: ${errorData.message || 'Unknown error'}`); // Use custom alert
          }
        } catch (err) {
          console.error('Network error deleting employee:', err);
          openAlertDialog('Error', 'An unexpected error occurred while deleting the employee.'); // Use custom alert
        }
      }
    );
  };

  if (loading) {
    return <div className="text-center text-gray-300 py-8">Loading employees...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 py-8">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full">
      <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Employee Management</h2>

      {/* Create New Employee Form */}
      <div className="mb-8 p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
        <h3 className="text-xl font-semibold text-white mb-4">Create New Employee</h3>
        <form onSubmit={handleCreateEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User Details */}
          <div className="md:col-span-2 text-lg font-semibold text-gray-200">User Account Details</div>
          <div>
            <label htmlFor="newUserName" className="block text-gray-300 text-sm font-bold mb-2">
              Name
            </label>
            <input
              type="text"
              id="newUserName"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="newUserEmail" className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="newUserEmail"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="newUserPassword" className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="newUserPassword"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
              value={newUserPassword}
              onChange={(e) => setNewUserPassword(e.target.value)}
              required
            />
          </div>

          {/* Employee Details */}
          <div className="md:col-span-2 mt-4 text-lg font-semibold text-gray-200">Employee Details</div>
          <div>
            <label htmlFor="newEmployeeId" className="block text-gray-300 text-sm font-bold mb-2">
              Employee ID
            </label>
            <input
              type="text"
              id="newEmployeeId"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
              value={newEmployeeId}
              onChange={(e) => setNewEmployeeId(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="newDepartment" className="block text-gray-300 text-sm font-bold mb-2">
              Department
            </label>
            <select
              id="newDepartment"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
              required
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept._id} value={dept._id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="newDesignation" className="block text-gray-300 text-sm font-bold mb-2">
              Designation
            </label>
            <select
              id="newDesignation"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600"
              value={newDesignation}
              onChange={(e) => setNewDesignation(e.target.value)}
              required
            >
              <option value="">Select Designation</option>
              {designations.map(desig => (
                <option key={desig._id} value={desig._id}>{desig.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="newHireDate" className="block text-gray-300 text-sm font-bold mb-2">
              Hire Date
            </label>
            <input
              type="date"
              id="newHireDate"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
              value={newHireDate}
              onChange={(e) => setNewHireDate(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="newSalary" className="block text-gray-300 text-sm font-bold mb-2">
              Salary
            </label>
            <input
              type="number"
              id="newSalary"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
              value={newSalary}
              onChange={(e) => setNewSalary(parseFloat(e.target.value))}
              required
            />
          </div>
          <div>
            <label htmlFor="newContactNumber" className="block text-gray-300 text-sm font-bold mb-2">
              Contact Number
            </label>
            <input
              type="text"
              id="newContactNumber"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
              value={newContactNumber}
              onChange={(e) => setNewContactNumber(e.target.value)}
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="newAddress" className="block text-gray-300 text-sm font-bold mb-2">
              Address
            </label>
            <textarea
              id="newAddress"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              rows={3}
            ></textarea>
          </div>

          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
              disabled={creatingEmployee}
            >
              {creatingEmployee ? 'Creating...' : 'Create Employee'}
            </button>
          </div>
        </form>
        {createError && <p className="text-red-400 text-sm mt-4 text-center">{createError}</p>}
        {createSuccess && <p className="text-green-400 text-sm mt-4 text-center">{createSuccess}</p>}
      </div>

      {/* Employees List */}
      <div className="p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
        <h3 className="text-xl font-semibold text-white mb-4">Existing Employees</h3>
        {employees.length === 0 ? (
          <p className="text-gray-400 text-center">No employees found for this company.</p>
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
                    Employee ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Department
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Designation
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
                {employees.map((employee) => (
                  <tr key={employee._id} className="hover:bg-gray-600 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {employee.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {employee.user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {employee.employeeId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {employee.department?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {employee.designation?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        employee.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.status === 1 ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(employee)}
                        className="text-green-400 hover:text-green-300 mr-3 transition duration-150"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteEmployee(employee._id, employee.user.name)}
                        className="text-red-400 hover:text-red-300 transition duration-150"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Employee Modal */}
      {isEditModalOpen && currentEmployee && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Edit Employee</h3>
            <form onSubmit={handleUpdateEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Details */}
              <div className="md:col-span-2 text-lg font-semibold text-gray-200">User Account Details</div>
              <div>
                <label htmlFor="editUserName" className="block text-gray-300 text-sm font-bold mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="editUserName"
                  className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="editUserEmail" className="block text-gray-300 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="editUserEmail"
                  className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  required
                />
              </div>

              {/* Employee Details */}
              <div className="md:col-span-2 mt-4 text-lg font-semibold text-gray-200">Employee Details</div>
              <div>
                <label htmlFor="editEmployeeId" className="block text-gray-300 text-sm font-bold mb-2">
                  Employee ID
                </label>
                <input
                  type="text"
                  id="editEmployeeId"
                  className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
                  value={editEmployeeId}
                  onChange={(e) => setEditEmployeeId(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="editDepartment" className="block text-gray-300 text-sm font-bold mb-2">
                  Department
                </label>
                <select
                  id="editDepartment"
                  className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600"
                  value={editDepartment}
                  onChange={(e) => setEditDepartment(e.target.value)}
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept._id} value={dept._id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="editDesignation" className="block text-gray-300 text-sm font-bold mb-2">
                  Designation
                </label>
                <select
                  id="editDesignation"
                  className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600"
                  value={editDesignation}
                  onChange={(e) => setEditDesignation(e.target.value)}
                  required
                >
                  <option value="">Select Designation</option>
                  {designations.map(desig => (
                    <option key={desig._id} value={desig._id}>{desig.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="editHireDate" className="block text-gray-300 text-sm font-bold mb-2">
                  Hire Date
                </label>
                <input
                  type="date"
                  id="editHireDate"
                  className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
                  value={editHireDate}
                  onChange={(e) => setEditHireDate(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="editSalary" className="block text-gray-300 text-sm font-bold mb-2">
                  Salary
                </label>
                <input
                  type="number"
                  id="editSalary"
                  className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
                  value={editSalary}
                  onChange={(e) => setEditSalary(parseFloat(e.target.value))}
                  required
                />
              </div>
              <div>
                <label htmlFor="editContactNumber" className="block text-gray-300 text-sm font-bold mb-2">
                  Contact Number
                </label>
                <input
                  type="text"
                  id="editContactNumber"
                  className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
                  value={editContactNumber}
                  onChange={(e) => setEditContactNumber(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="editAddress" className="block text-gray-300 text-sm font-bold mb-2">
                  Address
                </label>
                <textarea
                  id="editAddress"
                  className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
                  value={editAddress}
                  onChange={(e) => setEditAddress(e.target.value)}
                  rows={3}
                ></textarea>
              </div>
              <div>
                <label htmlFor="editStatus" className="block text-gray-300 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  id="editStatus"
                  className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600"
                  value={editStatus}
                  onChange={(e) => setEditStatus(parseInt(e.target.value))}
                  required
                >
                  <option value={1}>Active</option>
                  <option value={2}>Inactive</option>
                </select>
              </div>
              {updateError && <p className="text-red-400 text-sm mt-2 text-center">{updateError}</p>}
              {updateSuccess && <p className="text-green-400 text-sm mt-2 text-center">{updateSuccess}</p>}
              <div className="md:col-span-2 flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                  disabled={updatingEmployee}
                >
                  {updatingEmployee ? 'Updating...' : 'Update Employee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Alert/Confirmation Modal */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm border border-gray-700 text-center">
            <h3 className="text-xl font-bold text-white mb-4">
              {customModalTitle}
            </h3>
            <p className="text-gray-300 mb-6">
              {customModalMessage}
            </p>
            <div className="flex justify-center space-x-4">
              {customModalType === 'confirm' && (
                <button
                  onClick={() => {
                    if (customModalOnConfirm) {
                      customModalOnConfirm();
                    }
                    closeCustomModal();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
                >
                  Confirm
                </button>
              )}
              <button
                onClick={closeCustomModal}
                className={`${
                  customModalType === 'alert' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'
                } text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105`}
              >
                {customModalType === 'alert' ? 'OK' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeManagement;