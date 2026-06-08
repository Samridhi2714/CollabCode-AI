import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../styles/home.css";
import toast from "react-hot-toast";
import { FaBolt, FaDocker, FaComments, FaBrain } from "react-icons/fa";

function Home() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const createRoom = () => {
    const id = uuidv4();
    navigate(`/room/${id}`);
  };
  const joinRoom = () => {
    if (!roomId) {
      return toast.error("Please enter Room ID");
    }
    navigate(`/room/${roomId}`);
  };

  return (
    <div className="home-page">
      <div className="home-container">
        {/* LEFT HERO */}
        <div className="hero-section">
          <h1>
            Code Together With
            <br />
            <span>CollabCode AI</span>
          </h1>

          <p>
            Real-time collaborative coding platform with multi-language
            execution, live chat, role-based editing, Docker sandboxing and
            version control.
          </p>
          <div className="hero-features">
            <div className="feature-item">
              <FaBolt className="feature-icon" />
              Real-Time Collaborative Editor
            </div>

            <div className="feature-item">
              <FaDocker className="feature-icon" />
              Secure Docker Code Execution
            </div>

            <div className="feature-item">
              <FaComments className="feature-icon" />
              Live Chat + User Roles
            </div>

            <div className="feature-item">
              <FaBrain className="feature-icon" />
              Multi-Language Compiler
            </div>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="home-card">
          <h2>Start Coding</h2>
          <button className="home-btn create-btn" onClick={createRoom}>
            Create New Room
          </button>
          <div className="divider">OR</div>
          <input
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="room-input"
          />
          <button className="home-btn join-btn" onClick={joinRoom}>
            Join Existing Room
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
