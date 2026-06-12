import { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/dashboard.css";
import {
  FaCode,
  FaBolt,
  FaUsers,
  FaRocket,
  FaComments,
  FaSignOutAlt,
} from "react-icons/fa";

function Dashboard() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);
  if (loading) {
    return <p>Loading...</p>;
  }
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="workspace-page">
      {/* HEADER */}
      <div className="workspace-header">
        <div className="workspace-logo">
          <FaCode size={34} color="#3b82f6" />
          <div>
            <h1>Collab Workspace</h1>
            <p>Your real-time coding universe</p>
          </div>
        </div>

        <div className="workspace-actions">
          <button
            className="workspace-btn primary-btn"
            onClick={() => navigate("/")}
          >
            Open Workspace
          </button>
          <button className="workspace-btn logout-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      {/* HERO */}
      <div className="workspace-hero">
        <h2>
          Welcome back, <span>{user?.name}</span>
        </h2>
        <p>
          Build, collaborate and execute code 
          securely in real-time with
          multi-language support, live editing, 
          AI assistance, team chat,
          version control and collaborative development tools.
        </p>
      </div>
      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Languages Supported</h3>
          <p>5</p>
        </div>
        <div className="stat-card">
          <h3>Execution Engine</h3>
          <p>Cloud Sandbox</p>
        </div>
        <div className="stat-card">
          <h3>Collaboration</h3>
          <p>Live</p>
        </div>
        <div className="stat-card">
          <h3>Project Status</h3>
          <p>Active</p>
        </div>
      </div>

      {/* FEATURES */}
      <div className="feature-grid">
        <div className="feature-card">
          <FaBolt size={34} color="#3b82f6" />
          <h3>Real-Time Coding</h3>
          <p>
            Collaborate instantly with multiple developers in the same coding
            room.
          </p>
        </div>
        <div className="feature-card">
          <FaRocket size={34} color="#3b82f6" />
          <h3>Multi-Language Execution</h3>
          <p>
            Execute JavaScript, Python, 
            Java, C and C++ securely through 
            a cloud-based sandbox environment using JDoodle API.
          </p>
        </div>
        <div className="feature-card">
          <FaComments size={34} color="#3b82f6" />
          <h3>Live Team Chat</h3>
          <p>Communicate with collaborators in real-time while coding.</p>
        </div>
        <div className="feature-card">
          <FaUsers size={34} color="#3b82f6" />
          <h3>Role Management</h3>
          <p>
            Admins, editors and viewers with collaborative access control
            support.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
