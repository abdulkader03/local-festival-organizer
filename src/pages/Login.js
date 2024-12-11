import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // For navigation

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost/login.php", formData);
      if (response.data.success) {
        setMessage(`Welcome, ${response.data.user.name}!`);
          navigate("/events"); // Redirect to the home page
    ; // Add a slight delay to show the welcome message
      } else {
        setMessage(response.data.message);
      }
    } catch (error) {
      setMessage("Error logging in");
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
      <button onClick={() => navigate("/register")}>
        Don't have an account? Register
      </button>
    </div>
  );
};

export default Login;
