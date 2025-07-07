import React, { useState, useEffect } from 'react';

/**
 * Interface for Company data.
 * This should match the structure of company objects returned by your backend.
 */
interface Company {
  _id: string;
  name: string;
  logo: string;
  admin: {
    _id: string;
    name: string;
    email: string;
    status: number; // Assuming 1 for active, 2 for inactive
  };
  status: number; // Assuming 1 for active, 2 for inactive
  createdAt: string;
  updatedAt: string;
}

/**
 * Props for CompanyManagement component.
 * @param token - The authentication token for API calls.
 */
interface CompanyManagementProps {
  token: string;
}

/**
 * CompanyManagement Component
 * Displays a list of companies and provides functionality to create new companies.
 * This component will be used within the SuperAdminDashboard.
 * Styled with Tailwind CSS.
 */
const CompanyManagement: React.FC<CompanyManagementProps> = ({ token }) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for new company form
  const [newCompanyName, setNewCompanyName] = useState<string>('');
  const [newCompanyAdminEmail, setNewCompanyAdminEmail] = useState<string>('');
  const [newCompanyLogo, setNewCompanyLogo] = useState<string>(''); // Placeholder for logo URL
  const [creatingCompany, setCreatingCompany] = useState<boolean>(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  /**
   * Fetches the list of companies from the backend.
   */
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/companies', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`, // Authenticated request
          },
        });

        if (response.ok) {
          const data: Company[] = await response.json();
          setCompanies(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Failed to fetch companies.');
        }
      } catch (err) {
        console.error('Network error fetching companies:', err);
        setError('An unexpected error occurred while fetching companies.');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [token]); // Re-fetch if token changes (e.g., on re-login)

  /**
   * Handles the creation of a new company.
   * @param e - The form event object.
   */
  const handleCreateCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreatingCompany(true);
    setCreateError(null);
    setCreateSuccess(null);

    // Basic client-side validation for the new company form
    if (!newCompanyName || !newCompanyAdminEmail || !newCompanyLogo) {
      setCreateError('All fields are required for creating a company.');
      setCreatingCompany(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Authenticated request
        },
        body: JSON.stringify({ 
          name: newCompanyName, 
          adminEmail: newCompanyAdminEmail, // Backend expects adminEmail
          logo: newCompanyLogo 
        }),
      });

      if (response.ok) {
        const newCompany: Company = await response.json();
        setCompanies((prevCompanies) => [...prevCompanies, newCompany]); // Add new company to list
        setNewCompanyName('');
        setNewCompanyAdminEmail('');
        setNewCompanyLogo('');
        setCreateSuccess('Company created successfully!');
      } else {
        const errorData = await response.json();
        setCreateError(errorData.message || 'Failed to create company.');
      }
    } catch (err) {
      console.error('Network error creating company:', err);
      setCreateError('An unexpected error occurred while creating the company.');
    } finally {
      setCreatingCompany(false);
    }
  };

  if (loading) {
    return <div className="text-center text-gray-300">Loading companies...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">Error: {error}</div>;
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700 w-full">
      <h2 className="text-3xl font-bold text-indigo-400 mb-6 text-center">Company Management</h2>

      {/* Create New Company Form */}
      <div className="mb-8 p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
        <h3 className="text-xl font-semibold text-white mb-4">Create New Company</h3>
        <form onSubmit={handleCreateCompany} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="companyName" className="block text-gray-300 text-sm font-bold mb-2">
              Company Name
            </label>
            <input
              type="text"
              id="companyName"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-600 placeholder-gray-400"
              value={newCompanyName}
              onChange={(e) => setNewCompanyName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="adminEmail" className="block text-gray-300 text-sm font-bold mb-2">
              Admin Email
            </label>
            <input
              type="email"
              id="adminEmail"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-600 placeholder-gray-400"
              value={newCompanyAdminEmail}
              onChange={(e) => setNewCompanyAdminEmail(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2">
            <label htmlFor="companyLogo" className="block text-gray-300 text-sm font-bold mb-2">
              Company Logo URL
            </label>
            <input
              type="url"
              id="companyLogo"
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-2 px-3 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-600 placeholder-gray-400"
              placeholder="e.g., https://placehold.co/150x50/000000/FFFFFF?text=Logo"
              value={newCompanyLogo}
              onChange={(e) => setNewCompanyLogo(e.target.value)}
              required
            />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300 ease-in-out transform hover:scale-105"
              disabled={creatingCompany}
            >
              {creatingCompany ? 'Creating...' : 'Create Company'}
            </button>
          </div>
        </form>
        {createError && <p className="text-red-400 text-sm mt-4 text-center">{createError}</p>}
        {createSuccess && <p className="text-green-400 text-sm mt-4 text-center">{createSuccess}</p>}
      </div>

      {/* Companies List */}
      <div className="p-4 bg-gray-700 rounded-lg shadow-md border border-gray-600">
        <h3 className="text-xl font-semibold text-white mb-4">Existing Companies</h3>
        {companies.length === 0 ? (
          <p className="text-gray-400 text-center">No companies found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-600">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider rounded-tl-lg">
                    Logo
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-200 uppercase tracking-wider">
                    Admin Email
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
                {companies.map((company) => (
                  <tr key={company._id} className="hover:bg-gray-600 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img 
                        src={company.logo || `https://placehold.co/50x50/000000/FFFFFF?text=Logo`} 
                        alt={`${company.name} Logo`} 
                        className="h-10 w-10 rounded-full object-cover" 
                        onError={(e) => { 
                          e.currentTarget.src = `https://placehold.co/50x50/000000/FFFFFF?text=Logo`; 
                          e.currentTarget.onerror = null; 
                        }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                      {company.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {company.admin?.email || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        company.status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {company.status === 1 ? 'Active' : 'Inactive'}
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

export default CompanyManagement;