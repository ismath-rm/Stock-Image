import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword } from '../Redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error } = useSelector((state) => state.auth); // Assuming the slice name is 'auth'

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error('Email is required');
      return;
    }

    // Dispatch forgotPassword action
    dispatch(forgotPassword({ email }))
      .unwrap()
      .then(() => {
        toast.success('Password reset link sent to email');
        setEmail('');
        
      })
      .catch((err) => {
        console.error('Error sending reset link:', err);
        toast.error(err.detail || 'An error occurred while sending the reset link');
      });
  };

  return (
    <div className="flex w-full h-screen items-center justify-center" style={{ backgroundColor: '#221d30' }}>
      <div className="bg-[#38304f] bg-opacity-75 backdrop-blur-md w-full md:w-96 p-8 rounded-lg shadow-2xl">
        <form className="flex flex-col w-full text-left" onSubmit={handleSubmit}>
          <p className="text-3xl text-white font-bold text-center">Forgot Password</p>
          <div className="mt-4"></div>
          <label className="text-left block text-gray-300 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 mb-3 text-sm font-medium outline-none bg-white placeholder:text-gray-700 text-black rounded-lg"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="mt-8">
            <button
              type="submit"
              className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold py-2 px-4 w-full rounded-lg hover:bg-blue-500"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Reset Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
