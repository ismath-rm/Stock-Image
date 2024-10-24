import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../Redux/authSlice"; // Ensure this is the correct path to your authSlice
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ username: "", password: "", login: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth); // Get the auth state from the Redux store

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "username") {
      const alphaRegex = /^[a-zA-Z]+$/; // Only alphabetic characters allowed
      setUsername(value.trim());

      if (value.trim().length < 4 && value.trim().length > 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Username must be longer than 3 characters",
        }));
      } else if (!alphaRegex.test(value.trim()) && value.trim().length > 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          username: "Username must contain only alphabetic characters",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
      }
    } else if (id === "password") {
      setPassword(value.trim());

      if (value.trim().length < 4 && value.trim().length > 0) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must be longer than 4 characters",
        }));
      } else if (value.includes(" ")) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password cannot contain spaces",
        }));
      } else {
        setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
      }
    }
  };

  const validateForm = () => {
    if (errors.username || errors.password) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const loginData = { username, password };

    // Dispatch the login thunk
    try {
      const resultAction = await dispatch(login(loginData));

      if (login.fulfilled.match(resultAction)) {
        // If login is successful, navigate to user dashboard
        toast.success("Login successful");
        navigate("/home");
      } else {
        // If login fails, show error
        toast.error("Invalid username or password");
        setErrors((prevErrors) => ({
          ...prevErrors,
          login: "Invalid username or password",
        }));
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
      setErrors((prevErrors) => ({
        ...prevErrors,
        login: "An unexpected error occurred",
      }));
    }
  };

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center" style={{ backgroundColor: "#221d30" }}>
      <div className="w-full max-w-md bg-[#38304f] shadow-md rounded-lg p-6 mt-16 mx-4">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white">Welcome to Stock Image</h2>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
            />
            {errors.username && <p className="text-red-500">{errors.username}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={passwordVisible ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:border-blue-500"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-2 text-gray-500"
                aria-label={passwordVisible ? "Hide password" : "Show password"}
              >
                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
              </button>
            </div>
            {errors.password && <p className="text-red-500">{errors.password}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-bold rounded-lg"
            disabled={authState.isLoading}
          >
            {authState.isLoading ? "Logging in..." : "Login"}
          </button>
          {errors.login && <p className="text-red-500 mt-2">{errors.login}</p>}
        </form>

        <div>
          <Link className="span text-white" to="/forgot_password">
            Forgot Password?
          </Link>
        </div>

        <div className="mt-4 text-center text-sm text-gray-300">
          Don't have an account?{" "}
          <Link to="/signup" className="text-white hover:underline">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
