import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from '../services/authService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');


  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const result = await forgotPassword(email, newPassword);
      setMessage(result);
      setEmail('');
      setNewPassword('');
      navigate('/login');

    } catch (err) {
      setError(err.response?.data || 'Failed to reset password.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-black">
      <div className="bg-[#1D1C20] p-10 rounded-xl shadow-md w-full max-w-md space-y-6">
        <h2 className="text-3xl font-semibold text-center text-white">Forgot Password</h2>

        {message && <div className="text-green-400 text-sm text-center">{message}</div>}
        {error && <div className="text-red-400 text-sm text-center">{error}</div>}

        <form onSubmit={handleResetPassword} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-orange-300 rounded-lg text-white bg-[#1D1C20] focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-1">New Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-orange-300 rounded-lg text-white bg-[#1D1C20] focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;


