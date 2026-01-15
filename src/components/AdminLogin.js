import { useState } from "react";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminLogin.css";
import { useEffect } from "react";
const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const API_URL = process.env.REACT_APP_APIURL;
  useEffect(() => {
  if (localStorage.getItem("adminToken")) {
    window.location.href = "/admin/dashboard";
  }
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/admin/login`, {
        username,
        password,
      });

      localStorage.setItem("adminToken", res.data.token);

      toast.success("Login successful!", {
        position: "top-right",
        autoClose: 1500,
      });

      setTimeout(() => {
        window.location.href = "/admin/dashboard";
      }, 1600);

    } catch (err) {
      toast.error("Invalid username or password", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="admin-login-wrapper">
      <form className="admin-login-box" onSubmit={handleSubmit}>
        <h1>Admin Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <div className="password-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <span
            className="eye-icon"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button type="submit">Log In</button>
      </form>

      {/* Toast container */}
      <ToastContainer />
    </div>
  );
};

export default AdminLogin;
