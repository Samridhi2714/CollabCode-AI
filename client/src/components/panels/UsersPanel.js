import {
  FaCrown,
  FaPen,
  FaEye,
} from "react-icons/fa";
function UsersPanel({
  usersList,
  username,
  currentUserRole,
  makeEditor,
}) {
  return (
  <div className="users-panel">

    {usersList.map((user, i) => (
      <div
        key={i}
        className="user-card"
      >
        <div className="user-info">
          
          {/* STATUS DOT */}
          <div className="online-dot"></div>

          <p className="user-name">
            {user.username === username
              ? "You"
              : user.username}
          </p>

          {/* ROLE BADGES */}
          {user.role === "admin" && (
            <span className="admin-role">
              <FaCrown />
              Admin
            </span>
          )}

          {user.role === "editor" && (
            <span className="editor-role">
              <FaPen />
              Editor
            </span>
          )}

          {user.role === "viewer" && (
            <span className="viewer-role">
              <FaEye />
              Viewer
            </span>
          )}
        </div>

        {/* ADMIN ACTION */}
        {currentUserRole === "admin" &&
          user.role === "viewer" && (
            <button
              className="change-role"
              onClick={() =>
                makeEditor(user.username)
              }
            >
              Make Editor
            </button>
          )}
      </div>
    ))}
  </div>
);
}

export default UsersPanel;