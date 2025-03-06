import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PhoneLogin = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [cognitoUser, setCognitoUser] = useState(null);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(0);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { signInWithPhone, verifyOtp } = useAuth();
  
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const phone = query.get('phone');
    if (phone) {
      setPhoneNumber(phone);
      handleSendOtp(phone);
    }
  }, [location]);
  
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);
  
  const handleSendOtp = async (phone) => {
    const phoneToUse = phone || phoneNumber;
    if (!phoneToUse) {
      setError('Please enter your phone number');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      const user = await signInWithPhone(phoneToUse);
      setCognitoUser(user);
      setOtpSent(true);
      setTimer(30); // 30 seconds cooldown
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) {
      setError('Please enter the OTP');
      return;
    }
    
    try {
      setIsLoading(true);
      setError('');
      await verifyOtp(cognitoUser, otp);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Phone Verification</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {otpSent ? (
          <form onSubmit={handleVerifyOtp}>
            <div className="mb-6">
              <label htmlFor="otp" className="auth-label">
                Enter the OTP sent to {phoneNumber}
              </label>
              <input
                id="otp"
                type="text"
                className="auth-input"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit OTP"
                disabled={isLoading}
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              className="auth-button mb-4"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </span>
              ) : (
                'Verify OTP'
              )}
            </button>
            
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => handleSendOtp()}
                disabled={isLoading || timer > 0}
                className="text-primary hover:text-primary-dark text-sm font-medium"
              >
                {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }}>
            <div className="mb-6">
              <label htmlFor="phone" className="auth-label">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                className="auth-input"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+91XXXXXXXXXX"
                disabled={isLoading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Include country code (e.g., +91 for India)
              </p>
            </div>
            <button
              type="submit"
              className="auth-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Sending OTP...
                </span>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        )}
        
        <p className="text-center text-sm mt-6">
          <button
            onClick={() => navigate('/login')}
            className="text-primary hover:text-primary-dark font-medium"
          >
            Back to Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default PhoneLogin;