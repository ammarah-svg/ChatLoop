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
      <div className="flex items-center flex-col gap-4 p-4">
      <h1 className="font-poppins font-bold text-white mb-5">Create an account </h1>
      <form
        action=""
        
        onSubmit={handleSubmit}
      >
       
        <input
          name="username"
          value={username}
          onChange={handleChange}
          className="form-control w-[300px] block px-3 py-2 mb-4 focus:outline-none rounded"
          type="text"
          placeholder="Username"
        />
        <input
          type="email"
          placeholder="Email"
          name="email"
          value={email}
          onChange={handleChange}
          className="form-control px-3 py-2 w-[300px] block mb-4 focus:outline-none rounded"
        />
        <input
          name="password"
          value={password}
          onChange={handleChange}
          className="form-control px-3 py-2  w-[300px] mb-7 focus:outline-none rounded"
          type="password"
          placeholder="Password"
        />
        
        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}
        {success && <p className="text-green-500">{success}</p>} {/* Display success message */}
      
        <div className="text-center mt-2">
          <button
            type="submit"
            style={{ outlineWidth: '1px' }}
            className="ml-1 form-control text-white transition-all outline outline-[#e68cc0]  duration-300 border border-slate-500 rounded px-7 py-3 hover:bg-[#e68cc0]"
            s
          >
            Register
          </button>
        </div>
            
      
      </form>
</div>
<div>
  
<hr  style={{ width: '2px' }} className="bg-[#dfa8b9] h-52 "/>
</div>
     
<LoginForm/>

    </div>
  );
};

export default RegisterAndLoginForm;
