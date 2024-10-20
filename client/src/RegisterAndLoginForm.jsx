import React, { useState,useContext } from "react";
import axios from "axios";
import LoginForm from "./LoginForm";
import { UserContext } from "./UserContext";
const RegisterAndLoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // For displaying error messages
  const [success, setSuccess] = useState(""); // For displaying success messages
  const [isLoginOrRegister, setIsLoginOrRegister] = useState('login');
  const { setUsername: setLoggedInUsername, setId } = useContext(UserContext);
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "username") setUsername(value);
    if (name === "email") setEmail(value);
    if (name === "password") setPassword(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
   
    // Basic validation
    if (!username || !email || !password) {
      setError("All fields are required.");
      return;
    }
    
    try {
      const {data} = await axios.post("/register", {
        username,
        email,
        password,
      });
      setLoggedInUsername(username);
      setId(data.id);
      console.log(response.data);
      setSuccess("User registered successfully!");
      setError(""); // Clear error if the request was successful
    } catch (error) {
      console.error("Error registering user:", error);
      setError("Registration failed. Please try again."); // Update the error state
      setSuccess(""); // Clear success message on error
    }
  };

  return (
    <div className="flex items-center justify-center gap-16 container">
      <div className="flex items-center justify-center flex-col gap-4 p-4">
      <form
        action=""
        
        onSubmit={handleSubmit}
      >
        <label htmlFor=""></label>
        <input
          name="username"
          value={username}
          onChange={handleChange}
          className="form-control block p-3 mb-4 rounded"
          type="text"
          placeholder="Username"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChange}
          className="form-control p-3 block mb-4 rounded"
        />
        <input
          name="password"
          value={password}
          onChange={handleChange}
          className="form-control p-3 mb-7 rounded"
          type="password"
          placeholder="Password"
        />
        
        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
        {success && <p className="text-green-500">{success}</p>} {/* Display success message */}
      
       
              <button className="ml-1 form-control block bg-slate-500 rounded p-4" onClick={() => setIsLoginOrRegister('register')}>
                Register
              </button>
            
      
      </form>
</div>
<div>
<hr className="bg-stone-400 h-64 w-1"/>
</div>
     
<LoginForm/>

    </div>
  );
};

export default RegisterAndLoginForm;
