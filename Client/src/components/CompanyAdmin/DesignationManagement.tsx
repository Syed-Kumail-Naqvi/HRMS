// src/components/CompanyAdmin/DesignationManagement.tsx
import React, { useState, useEffect } from 'react';

/**
 * Interface for Designation data.
 * This should match the structure of designation objects returned by your backend.
 */
interface Designation {
  _id: string;
  name: string;
  company: string; // Company ID
  createdAt: string;
  updatedAt: string;
}

/**
 * Props for DesignationManagement component.
 * @param token - The authentication token for API calls.
 * @param userCompanyId - The ID of the company this admin belongs to.
 */
interface DesignationManagementProps {
  token: string;
  userCompanyId: string;
}

/**
 * DesignationManagement Component
 * Allows Company Admins to manage job designations specific to their company.
 * Provides functionality to create, view, edit, and delete designations.
 * Styled with Tailwind CSS.
 */
const DesignationManagement: React.FC<DesignationManagementProps> = ({ token, userCompanyId }) => {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for new designation form
  const [newDesignationName, setNewDesignationName] = useState<string>('');
  const [creatingDesignation, setCreatingDesignation] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // State for editing designation
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [currentDesignation, setCurrentDesignation] = useState<Designation | null>(null);
  const [editDesignationName, setEditDesignationName] = useState<string>('');
  const [updatingDesignation, setUpdatingDesignation] = useState<boolean>(false);
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
   * Fetches the list of designations for the current company from the backend.
   */
  const fetchDesignations = async () => {
    setLoading(true);
    setError(null);
    try {
      // API endpoint to get designations for a specific company
      const response = await fetch(`http://localhost:5000/api/companies/${userCompanyId}/designations`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data: Designation[] = await response.json();
        setDesignations(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch designations.');
      }
    } catch (err) {
      console.error('Network error fetching designations:', err);
      setError('An unexpected error occurred while fetching designations.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userCompanyId) { // Only fetch if userCompanyId is available
      fetchDesignations();
    }
  }, [token, userCompanyId]);

  /**
   * Handles the creation of a new designation.
   * @param e - The form event object.
   */
  const handleCreateDesignation = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingDesignation(true);
    setCreateError(null);
    setCreateSuccess(null);

    if (!newDesignationName) {
      setCreateError('Designation name is required.');
      setCreatingDesignation(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/companies/${userCompanyId}/designations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: newDesignationName, company: userCompanyId }),
      });

      if (response.ok) {
        await fetchDesignations(); // Re-fetch designations to get the most up-to-date list
        setNewDesignationName('');
        openAlertDialog('Success', 'Designation created successfully!'); // Use custom alert
      } else {
        const errorData = await response.json();
        openAlertDialog('Error', errorData.message || 'Failed to create designation.'); // Use custom alert
      }
    } catch (err) {
      console.error('Network error creating designation:', err);
      openAlertDialog('Error', 'An unexpected error occurred while creating the designation.'); // Use custom alert
    } finally {
      setCreatingDesignation(false);
    }
  };

  /**
   * Opens the edit modal and pre-fills the form with current designation data.
   * @param designation - The designation object to be edited.
   */
  const openEditModal = (designation: Designation) => {
    setCurrentDesignation(designation);
    setEditDesignationName(designation.name);
    setIsEditModalOpen(true);
    setUpdateError(null);
    setUpdateSuccess(null);
  };

  /**
   * Closes the edit modal.
   */
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCurrentDesignation(null);
  };

  /**
   * Handles the update of an existing designation.
   * @param e - The form event object.
   */
  const handleUpdateDesignation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentDesignation) return;

    setUpdatingDesignation(true);
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const response = await fetch(`http://localhost:5000/api/designations/${currentDesignation._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editDesignationName }),
      });

      if (response.ok) {
        // Update the designation in the local state
        setDesignations(designations.map(desig =>
          desig._id === currentDesignation._id
            ? { ...desig, name: editDesignationName }
            : desig
        ));
        openAlertDialog('Success', 'Designation updated successfully!'); // Use custom alert
        closeEditModal();
      } else {
        const errorData = await response.json();
        openAlertDialog('Error', errorData.message || 'Failed to update designation.'); // Use custom alert
      }
    } catch (err) {
      console.error('Network error updating designation:', err);
      openAlertDialog('Error', 'An unexpected error occurred while updating the designation.'); // Use custom alert
    } finally {
      setUpdatingDesignation(false);
    }
  };

  /**
   * Handles the deletion of a designation.
   * @param designationId - The ID of the designation to delete.
   * @param designationName - The name of the designation for confirmation.
   */
  const handleDeleteDesignation = async (designationId: string, designationName: string) => {
    openConfirmDialog(
      'Confirm Deletion',
      `Are you sure you want to delete designation "${designationName}"? This action cannot be undone.`,
      async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/designations/${designationId}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            setDesignations(designations.filter(desig => desig._id !== designationId));
            openAlertDialog('Success', `Designation "${designationName}" deleted successfully!`); // Use custom alert
          } else {
            const errorData = await response.json();
            openAlertDialog('Error', `Failed to delete designation: ${errorData.message || 'Unknown error'}`); // Use custom alert
          }
        } catch (err) {
          console.error('Network error deleting designation:', err);
          openAlertDialog('Error', 'An unexpected error occurred while deleting the designation.'); // Use custom alert
        }
      }
    );
  };

  if (loading) {
    return <div className="text-center text-gray-300 py-8">Loading designations...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 py-8">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full">
      <h2 className="text-3xl font-bold text-green-400 mb-6 text-center">Designation Management</h2>

      {/* Create New Designation Form */}
      <div className="mb-8 p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
        <h3 className="text-xl font-semibold text-white mb-4">Create New Designation</h3>
        <form onSubmit={handleCreateDesignation} className="grid grid-cols-1 gap-4">
          <div>
            <label htmlFor="designationName" className="block text-gray-300 text-sm font-bold mb-2">
              Designation Name
            </label>
            <input
              type="text"
              id="designationName"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
              value={newDesignationName}
              onChange={(e) => setNewDesignationName(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
              disabled={creatingDesignation}
            >
              {creatingDesignation ? 'Creating...' : 'Create Designation'}
            </button>
          </div>
        </form>
        {createError && <p className="text-red-400 text-sm mt-4 text-center">{createError}</p>}
        {createSuccess && <p className="text-green-400 text-sm mt-4 text-center">{createSuccess}</p>}
      </div>

      {/* Designations List */}
      <div className="p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
        <h3 className="text-xl font-semibold text-white mb-4">Existing Designations</h3>
        {designations.length === 0 ? (
          <p className="text-gray-400 text-center">No designations found for this company.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-600">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">
                    Designation Name
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
                {designations.map((designation) => (
                  <tr key={designation._id} className="hover:bg-gray-600 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {designation.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {designation.company}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => openEditModal(designation)}
                        className="text-green-400 hover:text-green-300 mr-3 transition duration-150"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDesignation(designation._id, designation.name)}
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

      {/* Edit Designation Modal */}
      {isEditModalOpen && currentDesignation && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700">
            <h3 className="text-2xl font-bold text-white mb-4 text-center">Edit Designation</h3>
            <form onSubmit={handleUpdateDesignation} className="space-y-4">
              <div>
                <label htmlFor="editDesignationName" className="block text-gray-300 text-sm font-bold mb-2">
                  Designation Name
                </label>
                <input
                  type="text"
                  id="editDesignationName"
                  className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-600 placeholder-gray-400"
                  value={editDesignationName}
                  onChange={(e) => setEditDesignationName(e.target.value)}
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
                  disabled={updatingDesignation}
                >
                  {updatingDesignation ? 'Updating...' : 'Update Designation'}
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

export default DesignationManagement;