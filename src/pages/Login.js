import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './styles.css';


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

        // Store user data in localStorage
        localStorage.setItem("user_id", response.data.user.id);
        localStorage.setItem("user_role", response.data.user.role);

        // Redirect based on role
        if (response.data.user.role === "organizer") {
          navigate("/dashboard"); // Redirect to organizer dashboard
        } else {
          navigate("/events"); // Redirect to regular home page
        }
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
