import { useState, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

function useVersionControl({
  roomId,
  files,
  username,
  userId,
  setFiles,
  setActiveFile,
  socket,
}) {
  const [commitMessage, setCommitMessage] = useState("");
  const [versions, setVersions] = useState([]);
  // ================= FETCH VERSIONS =================

  const fetchVersions = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/versions/${userId}`,
      );
      setVersions(res.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching versions");
    }
  }, [userId]);
  // ================= SAVE VERSION =================

  const saveVersion = async () => {
    try {
      if (!commitMessage.trim()) {
        toast.error("Please enter commit message");
        return;
      }
      if (!userId) {
        toast.error("User not loaded yet");
        return;
      }
      await axios.post(`${process.env.REACT_APP_API_URL}/api/versions/save`, {
        userId,
        roomId,
        // FULL FILE ARRAY
        files,
        message: commitMessage,
        committedBy: username,
      });
      toast.success("Version saved successfully");
      setCommitMessage("");
      fetchVersions();
    } catch (error) {
      console.error(error);
      toast.error("Error saving version");
    }
  };
  // ================= RESTORE VERSION =================
  const restoreVersion = (oldFiles) => {
    setFiles(oldFiles);
    setActiveFile(oldFiles[0].name);
    if (oldFiles.length > 0) {
      setActiveFile(oldFiles[0].name);
      socket.emit("active-file-change", {
        roomId,
        activeFile: oldFiles[0].name,
      });
    }
    socket.emit("code-change", {
      roomId,
      files: oldFiles,
    });
    toast.success("Version restored successfully");
  };

  // ================= DELETE VERSION =================

  const deleteVersion = async (id) => {
    try {
      const confirmDelete = window.confirm(
        "Are you sure you want to delete this version?",
      );
      if (!confirmDelete) return;
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/versions/${id}`);
      toast.success("Version deleted successfully");
      fetchVersions();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting version");
    }
  };

  return {
    commitMessage,
    setCommitMessage,
    versions,
    fetchVersions,
    saveVersion,
    restoreVersion,
    deleteVersion,
  };
}

export default useVersionControl;
