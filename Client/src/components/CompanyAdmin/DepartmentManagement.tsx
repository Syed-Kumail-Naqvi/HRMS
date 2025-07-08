// src/components/CompanyAdmin/DepartmentManagement.tsx
import React, { useState, useEffect } from 'react';

/**
 * Interface for Department data.
 * This should match the structure of department objects returned by your backend.
 */
interface Department {
  _id: string;
  name: string;
  company: string; // Company ID
  createdAt: string;
  updatedAt: string;
}

/**
 * Props for DepartmentManagement component.
 * @param token - The authentication token for API calls.
 * @param userCompanyId - The ID of the company this admin belongs to.
 */
interface DepartmentManagementProps {
  token: string;
  userCompanyId: string;
}

/**
 * DepartmentManagement Component
 * Allows Company Admins to manage departments specific to their company.
 * Provides functionality to create, view, edit, and delete departments.
 * Styled with Tailwind CSS.
 */
const DepartmentManagement: React.FC<DepartmentManagementProps> = ({ token, userCompanyId }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for new department form
  const [newDepartmentName, setNewDepartmentName] = useState<string>('');
  const [creatingDepartment, setCreatingDepartment] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // State for editing department
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentDepartment, setCurrentDepartment] = useState<Department | null>(null);
  const [editDepartmentName, setEditDepartmentName] = useState<string>('');
  const [updatingDepartment, setUpdatingDepartment] = useState<boolean>(false);
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
   * Fetches the list of departments for the current company from the backend.
   */
  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      // API endpoint to get departments for a specific company
      const response = await fetch(`http://localhost:5000/api/companies/${userCompanyId}/departments`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: Department[] = await response.json();
        setDepartments(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch departments.');
      }
    } catch (err) {
      console.error('Network error fetching departments:', err);
      setError('An unexpected error occurred while fetching departments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userCompanyId) { // Only fetch if userCompanyId is available
      fetchDepartments();
    }
  }, [token, userCompanyId]);

  /**
   * Handles the creation of a new department.
   * @param e - The form event object.
   */
  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingDepartment(true);
    setCreateError(null);
    setCreateSuccess(null);

    if (!newDepartmentName) {
      setCreateError('Department name is required.');
      setCreatingDepartment(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/companies/${userCompanyId}/departments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newDepartmentName, company: userCompanyId }),
      });

      if (response.ok) {
        await fetchDepartments(); // Re-fetch departments to get the most up-to-date list
        setNewDepartmentName('');
        openAlertDialog('Success', 'Department created successfully!'); // Use custom alert
      } else {
        const errorData = await response.json();
        openAlertDialog('Error', errorData.message || 'Failed to create department.'); // Use custom alert
      }
    } catch (err) {
      console.error('Network error creating department:', err);
      openAlertDialog('Error', 'An unexpected error occurred while creating the department.'); // Use custom alert
    } finally {
      setCreatingDepartment(false);
    }
  };

  /**
   * Opens the edit modal and pre-fills the form with current department data.
   * @param department - The department object to be edited.
   */
  const openEditModal = (department: Department) => {
    setCurrentDepartment(department);
    setEditDepartmentName(department.name);
    setIsEditModalOpen(true);
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  /**
   * Closes the edit modal.
   */
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentDepartment(null);
  };

  /**
   * Handles the update of an existing department.
   * @param e - The form event object.
   */
  const handleUpdateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDepartment) return;

    setUpdatingDepartment(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const response = await fetch(`http://localhost:5000/api/departments/${currentDepartment._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editDepartmentName }),
      });

      if (response.ok) {
        // Update the department in the local state
        setDepartments(departments.map(dept =>
          dept._id === currentDepartment._id
            ? { ...dept, name: editDepartmentName }
            : dept
        ));
        openAlertDialog('Success', 'Department updated successfully!'); // Use custom alert
        closeEditModal();
      } else {
        const errorData = await response.json();
        openAlertDialog('Error', errorData.message || 'Failed to update department.'); // Use custom alert
      }
    } catch (err) {
      console.error('Network error updating department:', err);
      openAlertDialog('Error', 'An unexpected error occurred while updating the department.'); // Use custom alert
    } finally {
      setUpdatingDepartment(false);
    }
  };

  /**
   * Handles the deletion of a department.
   * @param departmentId - The ID of the department to delete.
   * @param departmentName - The name of the department for confirmation.
   */
  const handleDeleteDepartment = async (departmentId: string, departmentName: string) => {
    openConfirmDialog(
      'Confirm Deletion',
      `Are you sure you want to delete department "${departmentName}"? This action cannot be undone.`,
      async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/departments/${departmentId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setDepartments(departments.filter(dept => dept._id !== departmentId));
            openAlertDialog('Success', `Department "${departmentName}" deleted successfully!`); // Use custom alert
          } else {
            const errorData = await response.json();
            openAlertDialog('Error', `Failed to delete department: ${errorData.message || 'Unknown error'}`); // Use custom alert
          }
        } catch (err) {
          console.error('Network error deleting department:', err);
          openAlertDialog('Error', 'An unexpected error occurred while deleting the department.'); // Use custom alert
        }
      }
    );
  };

  if (loading) {
    return <div className="text-center text-gray-300 py-8">Loading departments...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 py-8">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full">
      <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Department Management</h2>

      {/* Create New Department Form */}
      <div className="mb-8 p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
        <h3 className="text-xl font-semibold text-white mb-4">Create New Department</h3>
        <form onSubmit={handleCreateDepartment} className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="departmentName" className="block text-gray-300 text-sm font-bold mb-2">
              Department Name
            </label>
            <input
              type="text"
              id="departmentName"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
              value={newDepartmentName}
              onChange={(e) => setNewDepartmentName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
              disabled={creatingDepartment}
            >
              {creatingDepartment ? 'Creating...' : 'Create Department'}
            </button>
          </div>
        </form>
        {createError && <p className="text-red-400 text-sm mt-4 text-center">{createError}</p>}
        {createSuccess && <p className="text-green-400 text-sm mt-4 text-center">{createSuccess}</p>}
      </div>

      {/* Departments List */}
      <div className="p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
        <h3 className="text-xl font-semibold text-white mb-4">Existing Departments</h3>
        {departments.length === 0 ? (
          <p className="text-gray-400 text-center">No departments found for this company.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-600">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">
                    Department Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Company ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tr-lg">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-700 divide-y divide-gray-600">
                {departments.map((department) => (
                  <tr key={department._id} className="hover:bg-gray-600 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {department.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {department.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(department)}
                        className="text-green-400 hover:text-green-300 mr-3 transition duration-150"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDepartment(department._id, department.name)}
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

      {/* Edit Department Modal */}
      {isEditModalOpen && currentDepartment && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Edit Department</h3>
            <form onSubmit={handleUpdateDepartment} className="space-y-4">
              <div>
                <label htmlFor="editDepartmentName" className="block text-gray-300 text-sm font-bold mb-2">
                  Department Name
                </label>
                <input
                  type="text"
                  id="editDepartmentName"
                  className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
                  value={editDepartmentName}
                  onChange={(e) => setEditDepartmentName(e.target.value)}
                  required
                />
              </div>
              {updateError && <p className="text-red-400 text-sm mt-2 text-center">{updateError}</p>}
              {updateSuccess && <p className="text-green-400 text-sm mt-2 text-center">{updateSuccess}</p>}
              <div className="flex justify-end space-x-3 mt-6">
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
                  disabled={updatingDepartment}
                >
                  {updatingDepartment ? 'Updating...' : 'Update Department'}
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

export default DepartmentManagement;