import {
  FaUsers,
  FaCode,
  FaCircle,
  FaCopy,
  FaSignOutAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
function Topbar({
  roomId,
  language,
  changeLanguage,
  usersList,
  loading,
}) {
  const navigate = useNavigate();
  // COPY ROOM ID
  const copyRoomId = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success("Room ID Copied");
    } catch (err) {
      console.log(err);
    }
  };

  // LEAVE ROOM
  const leaveRoom = () => {
    navigate("/dashboard");
  };
  return (
    <div className="topbar">
      {/* LEFT */}
      <div className="topbar-left">
        <div className="logo-section">
          <FaCode className="logo-icon" />
          <div>
            <h2>CollabCode</h2>
            <p>
              Real-Time Collaborative IDE
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="topbar-right">
        {/* ROOM */}
        <div className="topbar-badge room-badge">
          Room:
          <span>
            {roomId.slice(0, 8)}...
          </span>
        </div>

        {/* USERS */}
        <div className="topbar-badge">
          <FaUsers />
          <span>{usersList.length}</span>
        </div>

        {/* LANGUAGE */}
        <select
          value={language}
          onChange={(e) =>
            changeLanguage(e.target.value)
          }
        >
          <option value="javascript">
            JavaScript
          </option>

          <option value="python">
            Python
          </option>

          <option value="cpp">
            C++
          </option>

          <option value="java">
            Java
          </option>

          <option value="c">
            C
          </option>
        </select>

        {/* STATUS */}
        <div className="status-badge">
          <FaCircle
            className={
              loading
                ? "status-running"
                : "status-ready"
            }
          />
          {loading
            ? "Running"
            : "Ready"}
        </div>

        {/* COPY */}
        <button
          className="topbar-action-btn"
          onClick={copyRoomId}
        >
          <FaCopy />
          Copy
        </button>

        {/* LEAVE */}
        <button
          className="topbar-action-btn leave-btn"
          onClick={leaveRoom}
        >
          <FaSignOutAlt />
          Leave
        </button>
      </div>
    </div>
  );
}

export default Topbar;