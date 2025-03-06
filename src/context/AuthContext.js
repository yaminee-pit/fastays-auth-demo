import React, { createContext, useState, useEffect, useContext } from 'react';
import { Auth } from 'aws-amplify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setLoading(true);
      const currentUser = await Auth.currentAuthenticatedUser();
      setUser(currentUser);
      setError(null);
    } catch (err) {
      setUser(null);
      if (err !== 'The user is not authenticated') {
        setError(err.message || 'An error occurred checking authentication state');
      }
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (username, password) => {
    try {
      setLoading(true);
      const user = await Auth.signIn(username, password);
      setUser(user);
      setError(null);
      return user;
    } catch (err) {
      setError(err.message || 'An error occurred during sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithPhone = async (phoneNumber) => {
    try {
      setLoading(true);
      // Start the custom auth flow with phone number
      const user = await Auth.signIn(phoneNumber);
      return user;
    } catch (err) {
      setError(err.message || 'An error occurred during phone sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (user, code) => {
    try {
      setLoading(true);
      const result = await Auth.sendCustomChallengeAnswer(user, code);
      if (result.signInUserSession) {
        setUser(result);
        setError(null);
      }
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred verifying OTP');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      await Auth.federatedSignIn({ provider: 'Google' });
      // Note: This will redirect the user, so we don't need to setUser here
    } catch (err) {
      setError(err.message || 'An error occurred during Google sign in');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      await Auth.signOut();
      setUser(null);
    } catch (err) {
      setError(err.message || 'An error occurred during sign out');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    signIn,
    signInWithPhone,
    verifyOtp,
    signInWithGoogle,
    signOut,
    checkAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;