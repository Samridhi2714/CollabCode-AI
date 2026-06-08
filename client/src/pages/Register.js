import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "../styles/auth.css";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      return toast.error("Please fill all fields");
    }
    try {
      setLoading(true);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        {
          name,
          email,
          password,
        }
      );
      toast.success("Registered Successfully");
      navigate("/login");
    } catch (err) {
      alert(
        err.response?.data?.message ||
        "Registration Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">
          Create Account
        </h1>
        <p className="auth-subtitle">
          Start collaborating in real-time.
        </p>
        <form
          className="auth-form"
          onSubmit={handleRegister}
        >
          <input
            type="text"
            placeholder="Enter Name"
            className="auth-input"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
          />
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
              ? "Creating Account..."
              : "Register"}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
export default Register;