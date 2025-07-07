import { useState, useEffect } from 'react';
import LoginPage from './components/LoginPage';
import DashboardPage from './components/DashboardPage';

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

function App() {
  // State to track authentication status and store user data
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  // State for initial authentication check loading to prevent flickering
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true); 

  // Effect to check for existing token in localStorage and verify it on component mount
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('hrmsToken');
      if (token) {
        try {
          // Attempt to fetch user profile using the stored token
          // This verifies the token's validity with the backend
          const response = await fetch('http://localhost:5000/api/me/profile', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
            },
          });

          if (response.ok) {
            const userData: UserData = await response.json();
            setIsAuthenticated(true);
            setUser(userData); // Set the actual user data from the backend
          } else {
            // Token is invalid or expired, or user not found
            console.error('Token verification failed:', response.status);
            localStorage.removeItem('hrmsToken'); // Clear invalid token
            setIsAuthenticated(false);
            setUser(null);
          }
        } catch (error) {
          // Network error or other unexpected issues during verification
          console.error('Error verifying token:', error);
          localStorage.removeItem('hrmsToken'); // Clear token on error
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoadingAuth(false); // Authentication check is complete
    };

    verifyAuth(); // Call the async function
  }, []); // Empty dependency array means this runs once on mount

  /**
   * Callback function for successful login from LoginPage.
   * Stores the token and updates authentication state.
   * @param token - The JWT received from the backend.
   * @param userData - The user object received from the backend.
   */
  const handleLoginSuccess = (token: string, userData: UserData) => {
    setIsAuthenticated(true);
    setUser(userData); // Set the user data received from the backend
    // The token is already stored in localStorage within LoginPage.tsx
  };

  /**
   * Callback function for logout.
   * Clears the token and resets authentication state.
   *
   * @returns {void}
   */
  const handleLogout = (): void => {
    localStorage.removeItem('hrmsToken'); // Remove the token from storage
    setIsAuthenticated(false);
    setUser(null); // Clear user data
  };

  // Show a loading indicator while checking authentication status
  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white text-xl">
        Loading authentication...
      </div>
    );
  }

  // Conditionally render LoginPage or DashboardPage based on authentication status
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  } else {
    return <DashboardPage onLogout={handleLogout} user={user} />;
  }
}

export default App;