import React, { useState } from 'react';

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
 * Props for LoginPage component.
 * @param onLoginSuccess - A callback function to be called upon successful login.
 */
interface LoginPageProps {
  // Changed 'any' to 'UserData' for better type safety
  onLoginSuccess: (token: string, user: UserData) => void; 
}

/**
 * LoginPage Component
 * Renders a login form with email and password fields.
 * Performs an actual POST request to the Express.js backend's login endpoint.
 * Handles loading states, errors, and calls a success callback.
 * Styled with Tailwind CSS.
 */
const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  // State to manage email and password input values
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  // State for displaying error messages
  const [error, setError] = useState<string>('');
  // State for loading indicator during submission
  const [loading, setLoading] = useState<boolean>(false);

  /**
   * Handles the form submission event.
   * Prevents default form submission, performs basic validation,
   * and makes an API call to the backend for login.
   * @param e - The form event object.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default browser form submission

    setError(''); // Clear previous errors
    setLoading(true); // Set loading state

    // Basic client-side validation (can be more robust)
    if (!email || !password) {
      setError('Please enter both email and password.');
      setLoading(false);
      return;
    }

    try {
      // Make the actual API call to your Express.js backend
      // Confirmed endpoint: http://localhost:5000/api/auth/login
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json(); // Parse the JSON response

      if (response.ok) { // Check if the response status is 2xx (success)
        console.log('Login successful:', data);
        // Store the token (e.g., in localStorage) and call the success callback
        localStorage.setItem('hrmsToken', data.token);
        // Pass user data and token to the parent component (App.tsx)
        // Ensure the 'data' object matches the 'UserData' interface
        onLoginSuccess(data.token, { 
          _id: data._id, 
          name: data.name, 
          email: data.email, 
          role: data.role, 
          company: data.company 
        });
      } else {
        // Handle API errors (e.g., invalid credentials, inactive account)
        console.error('Login failed:', data.message || 'Unknown error');
        setError(data.message || 'Login failed. Please check your credentials.');
      }
    } catch (err) {
      // Handle network errors or other unexpected issues
      console.error('Network or unexpected error during login:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-3xl font-extrabold text-white text-center mb-8">
          HRMS Login
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 placeholder-gray-400 transition duration-200"
              placeholder="superadmin@gmail.com" // Updated placeholder for backend
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="shadow appearance-none border border-gray-700 rounded-lg w-full py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-700 placeholder-gray-400 transition duration-200"
              placeholder="superadmin@123" // Updated placeholder for backend
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <p className="text-red-400 text-sm text-center mb-4">{error}</p>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:shadow-outline w-full transition duration-300 ease-in-out transform hover:scale-105"
              disabled={loading} // Disable button when loading
            >
              {loading ? 'Logging In...' : 'Login'}
            </button>
          </div>

          {/* Forgot Password / Sign Up Links (Placeholder) */}
          <div className="mt-6 text-center text-gray-400 text-sm">
            <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300 transition duration-200 mr-4">
              Forgot Password?
            </a>
            <span className="text-gray-600">|</span>
            <a href="#" className="font-semibold text-indigo-400 hover:text-indigo-300 transition duration-200 ml-4">
              Sign Up
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;