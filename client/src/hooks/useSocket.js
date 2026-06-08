import { useEffect } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
const socket = io(`${process.env.REACT_APP_API_URL}`);
function useSocket({
  roomId,
  username,
  setFiles,
  setChat,
  setUsersList,
  setTypingUser,
  setLanguage,
  setOutput,
  setActiveFile,
  setExecutionStatus,
  setExecutionTime,
  setExecutionError,
}) {
  useEffect(() => {
    if (!username) return;
    // JOIN ROOM
    socket.emit("join-room", {
      roomId,
      username,
    });

    // USER JOINED
    socket.on("user-joined", (msg) => {
      setChat((prev) => [
        ...prev,
        {
          system: true,
          text: msg,
        },
      ]);
    });

    // USER LEFT
    socket.on("user-left", (msg) => {
      setChat((prev) => [
        ...prev,
        {
          system: true,
          text: msg,
        },
      ]);
    });

    // CODE UPDATE
    socket.on("room-state", (roomState) => {
      setFiles(roomState.files);
      setOutput(roomState.output);
      setActiveFile(roomState.activeFile);
    });
    socket.on("code-update", (updatedFiles) => {
      setFiles(updatedFiles);
    });
    // FILE UPDATE
    socket.on("active-file-updated", (fileName) => {
      setActiveFile(fileName);
    });
    socket.on("files-update", (updatedFiles) => {
      setFiles(updatedFiles);
    });

    // CHAT MESSAGE
    socket.on("receive-message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    // ROOM USERS
    socket.on("room-users", (users) => {
      setUsersList(users);
    });

    // TYPING
    socket.on("userTyping", ({ username }) => {
      setTypingUser(username);
      // AUTO CLEAR AFTER 2 SECONDS
      setTimeout(() => {
        setTypingUser((prev) => {
          if (prev === username) {
            return "";
          }
          return prev;
        });
      }, 3000);
    });

    // STOP TYPING
    socket.on("userStoppedTyping", ({ username }) => {
      setTypingUser((prev) => {
        if (prev === username) {
          return "";
        }
        return prev;
      });
    });
    //EXECUTION RESULT
    socket.on("receive-execution-result", (result) => {
      setOutput(result.output);
      setExecutionStatus(result.status);
      setExecutionTime(result.executionTime);
      setExecutionError(result.error);
    });

    // LANGUAGE CHANGE
    socket.on("languageChanged", (lang) => {
      setLanguage(lang);
    });
    // ROLE CHANGE
    socket.on("role-changed", ({ role }) => {
      toast.success(`You are now a ${role}!`);
    });
    // CLEANUP
    return () => {
      socket.off("user-joined");
      socket.off("user-left");
      socket.off("code-update");
      socket.off("receive-message");
      socket.off("room-users");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
      socket.off("languageChanged");
      socket.off("role-changed");
      socket.off("receive-output");
      socket.off("room-state");
      socket.off("active-file-updated");
      socket.off("files-update");
      socket.off("receive-execution-result");
    };
  }, [
    roomId,
    username,
    setFiles,
    setChat,
    setUsersList,
    setTypingUser,
    setLanguage,
    setOutput,
    setActiveFile,
    setExecutionStatus,
    setExecutionTime,
    setExecutionError,
  ]);
  return socket;
}

export default useSocket;
