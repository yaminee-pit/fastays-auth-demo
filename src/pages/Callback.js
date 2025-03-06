import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Auth } from 'aws-amplify';
import { useAuth } from '../context/AuthContext';

const Callback = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { checkAuthState } = useAuth();
  
  useEffect(() => {
    // Handle OAuth callback
    const handleOAuthCallback = async () => {
      try {
        // Get the code from URL parameters
        const params = new URLSearchParams(location.search);
        const code = params.get('code');
        
        if (!code) {
          const errorMessage = params.get('error_description') || 'No authorization code found';
          throw new Error(errorMessage);
        }
        
        // Wait for Amplify to handle the code exchange
        await Auth.currentSession();
        
        // Refresh auth state
        await checkAuthState();
        
        // Redirect to dashboard
        navigate('/dashboard');
      } catch (err) {
        console.error('Error in OAuth callback:', err);
        setError(err.message || 'Error during authentication');
      }
    };
    
    handleOAuthCallback();
  }, [location, navigate, checkAuthState]);
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Processing Login</h2>
        
        {error ? (
          <div>
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="auth-button"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
            <p className="text-gray-600">Please wait while we complete your authentication...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Callback;