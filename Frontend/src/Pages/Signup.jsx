import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signup } from '../Redux/authSlice';
import { toast } from "react-toastify"; // Ensure you have this package installed

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // State for phone number
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "", // Error state for phone number
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Retrieve loading and error state from Redux store
  const { isLoading, error } = useSelector((state) => state.auth);

  // Handle input changes and validation
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "username") {
      const alphaRegex = /^[a-zA-Z]+$/;
      setUsername(value.trim());
      setErrors((prevErrors) => ({
        ...prevErrors,
        username:
          !alphaRegex.test(value.trim()) && value.trim().length > 0
            ? "Username must contain only alphabetic characters"
            : value.trim().length < 3 && value.trim().length > 0
            ? "Username must be longer than 3 characters"
            : "",
      }));
    } else if (id === "email") {
      setEmail(value.trim());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      setErrors((prevErrors) => ({
        ...prevErrors,
        email:
          !emailRegex.test(value.trim()) && value.trim().length > 0
            ? "Invalid email address"
            : "",
      }));
    } else if (id === "password") {
      setPassword(value.trim());
      setErrors((prevErrors) => ({
        ...prevErrors,
        password:
          value.trim().length < 4 && value.trim().length > 0
            ? "Password must be longer than 4 characters"
            : value.includes(" ")
            ? "Password cannot contain spaces"
            : "",
      }));
    } else if (id === "phoneNumber") {
      setPhoneNumber(value.trim());
      setErrors((prevErrors) => ({
        ...prevErrors,
        phoneNumber:
          !/^\d{10}$/.test(value.trim()) && value.trim().length > 0
            ? "Invalid phone number. It should be exactly 10 digits."
            : "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (errors.username || errors.email || errors.password || errors.phoneNumber) return; // Check for validation errors

    try {
        const action = await dispatch(signup({ username, email, password, phoneNumber }));

        if (signup.fulfilled.match(action)) {
            toast.success("Account created successfully!", { autoClose: 3000 });
            setTimeout(() => {
                navigate("/"); // Redirect after a successful signup
            }, 3000);
        } else {
            // Improved error handling
            toast.error(action.payload.error || "Signup failed", { autoClose: 3000 });
        }
    } catch (error) {
        console.error("Signup failed:", error);
        toast.error(error.message || "Signup failed", { autoClose: 3000 });
    }
};


  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center" style={{ backgroundColor: '#221d30' }}>
      <div className="w-full max-w-md bg-[#38304f] shadow-md rounded-lg p-6 mt-16 mx-4">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-white">Sign Up</h1>
          <p className="font-bold mt-1 text-white">Create an account</p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              autoComplete="username" // Better UX
            />
            {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              autoComplete="email" // Better UX
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          {/* New Phone Number Field after Email */}
          <div className="space-y-2">
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300">
              Phone Number
            </label>
            <input
              id="phoneNumber"
              type="text"
              value={phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter your phone number"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              autoComplete="tel" // Better UX
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handleInputChange}
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              autoComplete="new-password" // Better UX
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold rounded-lg hover:bg-gradient-to-l focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2"
            disabled={ errors.username || errors.email || errors.password || errors.phoneNumber || isLoading } // Disable if loading or validation errors exist
          >
            {isLoading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-300">
          Already have an account?{" "}
          <Link to="/" className="text-white hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
