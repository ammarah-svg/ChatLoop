import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";
import { ToastContainer } from "react-toastify";
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // For displaying error messages
  const [success, setSuccess] = useState(""); // For displaying success messages
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
  
    // Basic validation
    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }
  
    try {
      const { data } = await axios.post("/login", {
        email, // Make sure this matches the server's expected field
        password,
      });
      setLoggedInUsername(data.username); // Ensure your backend sends back the username
      setId(data.id); // Ensure your backend sends back the user ID
      setSuccess("User logged in successfully!"); // Set success message
      setError(""); // Clear any previous error messages
    } catch (error) {
      console.error("Error logging in:", error);
      const errorMessage = error.response?.data?.message || "Login failed. Please try again."; // Capture server error messages
      setError(errorMessage); // Set error message
      setSuccess(""); // Clear success message on error
    }
  };  

  return (

    <div className="login text-white flex flex-col gap-7">
      <ToastContainer/>
      <h1 className="font-poppins font-bold">Welcome back, </h1>
      <form onSubmit={handleLogin} className="flex flex-col">
        <input
          id="email-login"
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChange}
          className="form-control px-3 py-2  mb-7 text-black focus:outline-none rounded"
        />
        <input
          id="password-login"
          name="password"
          value={password}
          onChange={handleChange}
          className="form-control px-3 py-2  mb-7 focus:outline-none rounded text-black"
          type="password"
          placeholder="Password"
        />
        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
        {success && <p className="text-green-500">{success}</p>} {/* Display success message */}
        <div className="text-center mt-2">
        <button
  type="submit"
  style={{ outlineWidth: '1px' }}

  className="ml-1 form-control text-white transition-all outline  outline-[#e68cc0]  duration-300 border border-slate-500 rounded px-7 py-3 hover:bg-[#e68cc0]"
>
  Login
</button>

          
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
