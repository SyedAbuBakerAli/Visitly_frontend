import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loginResponse, setLoginResponse] = useState(null);
  const [registerResponse, setRegisterResponse] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("login"); // State for active tab
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("http://localhost:8081/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Login failed");
      const data = await response.json();
      setLoginResponse(data);
      localStorage.setItem("jwtToken", data.jwtToken);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch("http://localhost:8081/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error("Registration failed");
      const data = await response.text();
      setRegisterResponse(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <div className="tab-container">
        <button
          className={activeTab === "login" ? "active-tab" : ""}
          onClick={() => setActiveTab("login")}
        >
          Login
        </button>
        <button
          className={activeTab === "register" ? "active-tab" : ""}
          onClick={() => setActiveTab("register")}
        >
          Register
        </button>
      </div>

      <div className="form-container">
        {activeTab === "login" && (
          <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Login</button>
          </form>
        )}

        {activeTab === "register" && (
          <form onSubmit={handleRegister}>
            <h2>Register</h2>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
            <button type="submit">Register</button>
          </form>
        )}

        {registerResponse && activeTab === "register" && (
          <div className="response">
            <h3>{registerResponse}</h3>
          </div>
        )}

        {error && (
          <div className="error">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
