import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const { access } = useSelector((state) => state.auth);
  console.log("Access Token:", access);

  return access ? children : <Navigate to="/" />;
};

export default PrivateRoute;
