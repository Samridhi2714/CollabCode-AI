import ChatPanel from "../panels/ChatPanel";
import UsersPanel from "../panels/UsersPanel";
import GitPanel from "../panels/GitPanel";

import AIChat from "../ai/AIChat.js";

import {
  FaChevronLeft,
  FaChevronRight,
  FaComments,
  FaUsers,
  FaCodeBranch,
  FaRobot,
} from "react-icons/fa";

function RightPanel(props) {
  const {
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    setActiveTab,
    canUseMiniGit,
  } = props;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className={
        sidebarOpen
          ? "right-panel"
          : "right-panel collapsed"
      }
    >
      {/* TOGGLE BUTTON */}
      <button
        className="toggle-sidebar-btn"
        onClick={toggleSidebar}
      >
        {sidebarOpen ? (
          <FaChevronRight />
        ) : (
          <FaChevronLeft />
        )}
      </button>

      <div className="sidebar-content">
        {/* TABS */}
        <div className="panel-tabs">
          {/* CHAT */}
          <button
            className={
              activeTab === "chat"
                ? "active-tab"
                : ""
            }
            onClick={() =>
              setActiveTab("chat")
            }
          >
            <FaComments /> Chat
          </button>

          {/* USERS */}
          <button
            className={
              activeTab === "users"
                ? "active-tab"
                : ""
            }
            onClick={() =>
              setActiveTab("users")
            }
          >
            <FaUsers /> Users
          </button>

          {/* AI */}
          <button
            className={
              activeTab === "ai"
                ? "active-tab"
                : ""
            }
            onClick={() =>
              setActiveTab("ai")
            }
          >
            <FaRobot /> AI
          </button>

          {/* GIT */}
          {canUseMiniGit && (
            <button
              className={
                activeTab === "git"
                  ? "active-tab"
                  : ""
              }
              onClick={() =>
                setActiveTab("git")
              }
            >
              <FaCodeBranch /> Git
            </button>
          )}
        </div>

        {/* PANEL CONTENT */}
        <div className="panel-content">
          {activeTab === "chat" && (
            <ChatPanel {...props} />
          )}

          {activeTab === "users" && (
            <UsersPanel {...props} />
          )}

          {activeTab === "ai" && (
            <AIChat {...props} />
          )}

          {activeTab === "git" &&
            canUseMiniGit && (
              <GitPanel {...props} />
            )}
        </div>
      </div>
    </div>
  );
}

export default RightPanel;