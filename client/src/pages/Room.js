import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import axios from "axios";
import {
  FaPlay,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
} from "react-icons/fa";
import "../styles/room.css";
import "../styles/auth.css";
import "../styles/fileExplorer.css";
import FileExplorer from "../components/files/FileExplorer";
import Topbar from "../components/layout/Topbar";
import RightPanel from "../components/layout/RightPanel";
import useEditor from "../hooks/useEditor";
import useSocket from "../hooks/useSocket";
import useVersionControl from "../hooks/useVersionControl";

function Room() {
  const { roomId } = useParams();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState("");
  const [usersList, setUsersList] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [activeTab, setActiveTab] = useState("chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [output, setOutput] = useState("");
  const [executionTime, setExecutionTime] = useState(null);
  const [executionStatus, setExecutionStatus] = useState("idle");
  const [executionError, setExecutionError] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [programInput, setProgramInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([
    {
      name: "main.js",
      language: "javascript",
      content: "",
    },
  ]);
  const [activeFile, setActiveFile] = useState("main.js");
  const currentFile = files.find((file) => file.name === activeFile);
  // CURRENT USER
  const currentUser = usersList.find((u) => u.username === username);

  // CURRENT ROLE
  const currentUserRole = currentUser?.role;

  // MINI GIT ACCESS
  const canUseMiniGit =
    currentUserRole === "admin" || currentUserRole === "editor";

  // SOCKET
  const socket = useSocket({
    roomId,
    username,
    setFiles,
    setChat,
    setUsersList,
    setActiveFile,
    setTypingUser,
    setLanguage,
    setOutput,
    setExecutionStatus,
    setExecutionTime,
    setExecutionError,
  });

  // MONACO
  const { handleEditorDidMount } = useEditor({
    socket,
    roomId,
    username,
    sidebarOpen,
  });

  // VERSION CONTROL
  const {
    commitMessage,
    setCommitMessage,
    versions,
    fetchVersions,
    saveVersion,
    restoreVersion,
    deleteVersion,
  } = useVersionControl({
    roomId,
    files,
    userId,
    username,
    setFiles,
    setActiveFile,
    socket,
  });

  // FETCH USER
  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchUserAndJoin = async () => {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL}/api/auth/me`,
          {
            headers: {
              Authorization: token,
            },
          },
        );
        const data = await res.json();

        setUsername(data.name);
        setUserId(data.userId);
      } catch (err) {
        console.log("Error fetching user:", err);
      }
    };
    fetchUserAndJoin();
    //fetchVersions();
  }, [fetchVersions]);

  useEffect(() => {
    if (userId) {
      fetchVersions();
    }
  }, [userId, fetchVersions]);

  useEffect(() => {
    setShowInput(requiresInput(currentFile?.content, currentFile?.language));
  }, [currentFile]);

  // CODE CHANGE
  const handleEditorChange = (value) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file) =>
        file.name === activeFile
          ? {
              ...file,
              content: value,
            }
          : file,
      );
      socket.emit("code-change", {
        roomId,
        files: updatedFiles,
      });
      return updatedFiles;
    });
  };
  useEffect(() => {
    if (currentFile) {
      setLanguage(currentFile.language);
    }
  }, [currentFile]);
  // CHAT TYPING
  const handleTyping = () => {
    if (!username) return;
    socket.emit("typing", {
      roomId,
      username,
    });
  };

  // SEND CHAT
  const sendMessage = () => {
    if (!message) return;
    socket.emit("send-message", {
      roomId,
      message,
    });

    setChat((prev) => [
      ...prev,
      {
        user: username,
        text: message,
      },
    ]);
    setMessage("");
  };

  // LANGUAGE CHANGE
  const changeLanguage = (lang) => {
    setFiles((prevFiles) => {
      const updatedFiles = prevFiles.map((file) =>
        file.name === activeFile
          ? {
              ...file,
              language: lang,
            }
          : file,
      );
      socket.emit("file-added", {
        roomId,
        files: updatedFiles,
      });

      return updatedFiles;
    });
    setLanguage(lang);

    socket.emit("languageChange", {
      roomId,
      lang,
    });
  };

  // MAKE EDITOR
  const makeEditor = (targetUser) => {
    socket.emit("change-role", {
      roomId,
      targetUser,
      newRole: "editor",
    });
  };
  // INPUT DETECTOR
  const requiresInput = (code, language) => {
    if (!code) return false;

    switch (language) {
      case "java":
        return (
          code.includes("Scanner") ||
          code.includes("nextInt") ||
          code.includes("nextLine") ||
          code.includes("nextDouble")
        );

      case "cpp":
        return code.includes("cin >>") || code.includes("getline(cin");

      case "python":
        return code.includes("input(");

      case "javascript":
        return code.includes("prompt(") || code.includes("readline");

      case "c":
        return code.includes("scanf(") || code.includes("gets(");

      default:
        return false;
    }
  };
  // RUN CODE
  const runCode = async () => {
    try {
      setLoading(true);
      setOutput("");
      setExecutionError("");
      const startTime = performance.now();
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/execute`,
        {
          language: currentFile.language,
          code: currentFile?.content,
          input: programInput,
        },
      );
      const endTime = performance.now();
      setExecutionTime(((endTime - startTime) / 1000).toFixed(2));
      setExecutionStatus("success");
      setExecutionError("");
      const finalOutput = response.data.output;
      setOutput(finalOutput);
      socket.emit("execution-result", {
        roomId,
        output: finalOutput,
        status: "success",
        executionTime: ((endTime - startTime) / 1000).toFixed(2),
        error: "",
      });
    } catch (error) {
      const msg = error.response?.data?.error || "Execution Failed";
      setExecutionStatus("error");
      setExecutionError(msg);
      socket.emit("execution-result", {
        roomId,
        output: "",
        status: "error",
        executionTime: null,
        error: msg,
      });
    } finally {
      setLoading(false);
    }
  };
  //STATUS ICON LOGIC
  const statusConfig = {
    success: {
      icon: <FaCheckCircle />,
      text: "Success",
      color: "#22c55e",
    },
    error: {
      icon: <FaTimesCircle />,
      text: "Error",
      color: "#ef4444",
    },
    idle: {
      icon: <FaHourglassHalf />,
      text: "Idle",
      color: "#f59e0b",
    },
  };

  const currentStatus = statusConfig[executionStatus || "idle"];

  return (
    <div className="room-container">
      {/* TOPBAR */}
      <Topbar
        roomId={roomId}
        language={language}
        changeLanguage={changeLanguage}
        usersList={usersList}
        loading={loading}
      />

      {/* MAIN */}
      <div className="main-content">
        {/* LEFT */}
        <div className="editor-section">
          {/* MONACO */}
          <div className="editor-layout">
            <FileExplorer
              socket={socket}
              roomId={roomId}
              files={files}
              activeFile={activeFile}
              setActiveFile={setActiveFile}
              setFiles={setFiles}
              currentUserRole={currentUserRole}
            />
            <Editor
              key={activeFile}
              path={activeFile}
              height="calc(100vh-322px)"
              language={currentFile?.language}
              theme="vs-dark"
              value={currentFile?.content || ""}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              options={{
                automaticLayout: false,
                readOnly: currentUserRole === "viewer",
                fontSize: 15,
                minimap: {
                  enabled: false,
                },
              }}
            />
          </div>

          {/* RUN BAR */}
          <div className="run-bar">
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <button className="run-btn" onClick={runCode}>
                <FaPlay />
                {loading ? "Running..." : "Run Code"}
              </button>
              <button
                className="run-btn"
                onClick={() => setShowInput(!showInput)}
              >
                {showInput ? "Hide Input" : "Show Input"}
              </button>
              <div className="status-messages">
                {typingUser && (
                  <div className="typing-text">{typingUser} is typing...</div>
                )}

                {currentUserRole === "viewer" && (
                  <div className="viewer-text">You have viewer access</div>
                )}
              </div>
            </div>
          </div>
          {/* INPUT PANEL */}
          <div
            className="input-console"
            style={{ display: showInput ? "block" : "none" }}
          >
            <div className="output-header">INPUT</div>

            <textarea
              value={programInput}
              onChange={(e) => setProgramInput(e.target.value)}
              placeholder="Enter input..."
              rows={5}
            />
          </div>

          {/* EXECUTION RESULTS */}
          <div className="output-console">
            <div className="output-header">EXECUTION RESULTS</div>

            <div className="execution-info">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  color: currentStatus.color,
                }}
              >
                <strong>Status:</strong>
                {currentStatus.icon}
                {currentStatus.text}
              </div>

              <div>
                <strong>Time:</strong>{" "}
                {executionTime ? `${executionTime}s` : "--"}
              </div>
            </div>

            <div className="console-section">
              <h4>Output</h4>

              <pre>{output || "Output will appear here..."}</pre>
            </div>

            {executionError && (
              <div className="console-section error-box">
                <h4>Error</h4>

                <pre>{executionError}</pre>
              </div>
            )}
          </div>
        </div>
        {/* RIGHT PANEL */}
        <RightPanel
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          canUseMiniGit={canUseMiniGit}
          chat={chat}
          username={username}
          message={message}
          setMessage={setMessage}
          handleTyping={handleTyping}
          sendMessage={sendMessage}
          usersList={usersList}
          currentUserRole={currentUserRole}
          makeEditor={makeEditor}
          commitMessage={commitMessage}
          setCommitMessage={setCommitMessage}
          saveVersion={saveVersion}
          versions={versions}
          restoreVersion={restoreVersion}
          deleteVersion={deleteVersion}
          code={currentFile?.content}
          language={currentFile?.language}
        />
      </div>
    </div>
  );
}

export default Room;
