import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Auth } from 'aws-amplify';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        setLoading(true);
        
        // Get current authenticated user
        const currentUser = await Auth.currentAuthenticatedUser();
        const session = currentUser.signInUserSession;
        
        // Get user attributes
        const userAttributes = await Auth.currentUserInfo();
        
        // Get the tokens from the session
        const accessToken = session.accessToken.jwtToken;
        const idToken = session.idToken.jwtToken;
        
        setUserInfo({
          username: currentUser.username,
          attributes: userAttributes.attributes,
          accessToken: accessToken.substring(0, 20) + '...',
          idToken: idToken.substring(0, 20) + '...',
          provider: userAttributes.identities ? 
            userAttributes.identities[0]?.providerName || 'Cognito' 
            : 'Phone Number'
        });
      } catch (error) {
        console.error('Error getting user info:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getUserInfo();
  }, []);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <button
          onClick={handleSignOut}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Sign Out
        </button>
      </div>
      
      {userInfo && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary text-white py-4 px-6">
            <h2 className="text-xl font-semibold">User Information</h2>
          </div>
          <div className="p-6">
            <div className="mb-6">
              <p className="text-gray-500 text-sm mb-1">Authentication Provider</p>
              <p className="font-medium">{userInfo.provider}</p>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-500 text-sm mb-1">Username</p>
              <p className="font-medium">{userInfo.username}</p>
            </div>
            
            {userInfo.attributes && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {userInfo.attributes.email && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Email</p>
                    <p className="font-medium">{userInfo.attributes.email}</p>
                  </div>
                )}
                
                {userInfo.attributes.phone_number && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Phone Number</p>
                    <p className="font-medium">{userInfo.attributes.phone_number}</p>
                  </div>
                )}
                
                {userInfo.attributes.name && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Name</p>
                    <p className="font-medium">{userInfo.attributes.name}</p>
                  </div>
                )}
                
                {(userInfo.attributes.given_name || userInfo.attributes.family_name) && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Full Name</p>
                    <p className="font-medium">
                      {userInfo.attributes.given_name} {userInfo.attributes.family_name}
                    </p>
                  </div>
                )}
              </div>
            )}
            
            <div className="border-t border-gray-200 pt-4">
              <p className="text-gray-500 text-sm mb-2">Access Token (truncated)</p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
                {userInfo.accessToken}
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-4 mt-4">
              <p className="text-gray-500 text-sm mb-2">ID Token (truncated)</p>
              <div className="bg-gray-100 p-3 rounded-md font-mono text-xs overflow-x-auto">
                {userInfo.idToken}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;