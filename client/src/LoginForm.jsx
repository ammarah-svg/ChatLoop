import React, { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./UserContext";

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
        email,
        password,
      });
      setLoggedInUsername(data.username); // Adjust this according to your API response
      setId(data.id);
      setSuccess("User logged in successfully!");
      setError(""); // Clear error if the request was successful
    } catch (error) {
      console.error("Error logging in:", error);
      setError("Login failed. Please try again."); // Update the error state
      setSuccess("Ueer logged in"); // Clear success message on error
    }
  };

  return (
    <div className="login text-white flex flex-col gap-7">
      <form onSubmit={handleLogin} className="flex flex-col">
        <input
          id="email-login"
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChange}
          className="form-control p-3 mb-7 rounded"
        />
        <input
          id="password-login"
          name="password"
          value={password}
          onChange={handleChange}
          className="form-control p-3 mb-7 rounded text-black"
          type="password"
          placeholder="Password"
        />
        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
        {success && <p className="text-green-500">{success}</p>} {/* Display success message */}
        <div className="text-center mt-2">
          <button
            type="submit"
            className="ml-1 form-control bg-slate-500 rounded p-4"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
