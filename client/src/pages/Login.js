import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/auth.css";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please fill all fields");
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          email: email.toLowerCase(),
          password,
        }
      );
      localStorage.setItem("token",res.data.token);
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          Welcome Back
        </h1>
        <p className="auth-subtitle">
          Login to continue coding together.
        </p>
        <form
          className="auth-form"
          onSubmit={handleLogin}
        >
          <input
            type="email"
            placeholder="Enter Email"
            className="auth-input"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
          />
          <input
            type="password"
            placeholder="Enter Password"
            className="auth-input"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
          />
          <button
            type="submit"
            className="auth-btn"
            disabled={loading}
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>
        </form>
        <div className="auth-footer">
          Don’t have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;