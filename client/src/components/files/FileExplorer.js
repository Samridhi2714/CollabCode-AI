import toast from "react-hot-toast";
import { FaJs, FaJava, FaPython } from "react-icons/fa";

import { SiCplusplus } from "react-icons/si";

import { FiFileText, FiEdit2, FiTrash2 } from "react-icons/fi";
function FileExplorer({
  socket,
  roomId,
  files,
  activeFile,
  setActiveFile,
  setFiles,
  currentUserRole,
}) {
  // ADD FILE
  const addFile = () => {
    const fileName = prompt("Enter file name");
    if (!fileName) return;

    const extension = fileName.split(".").pop();

    let language = "javascript";

    if (extension === "js") language = "javascript";

    if (extension === "java") language = "java";

    if (extension === "py") language = "python";

    if (extension === "cpp") language = "cpp";
    const newFile = {
      name: fileName,
      language,
      content: "",
    };
    const updatedFiles = [...files, newFile];
    setFiles(updatedFiles);
    socket.emit("file-added", {
      roomId,
      files: updatedFiles,
    });
  };
  // RENAME
  const renameFile = (oldName) => {
    const newName = prompt("Enter new file name");
    if (!newName) return;
    const getLanguageFromExtension = (filename) => {
  const ext = filename.split(".").pop();
  switch (ext) {
    case "js":
      return "javascript";

    case "py":
      return "python";

    case "java":
      return "java";

    case "cpp":
      return "cpp";

    case "c":
      return "c";

    default:
      return "javascript";
  }
};

const updatedFiles = files.map((file) =>
  file.name === oldName
    ? {
        ...file,
        name: newName,
        language: getLanguageFromExtension(newName),
      }
    : file
);
    setFiles(updatedFiles);
    socket.emit("file-added", {
      roomId,
      files: updatedFiles,
    });
    if (activeFile === oldName) {
      setActiveFile(newName);
    }
  };
  // DELETE
  const deleteFile = (fileName) => {
    if (files.length === 1) {
      toast.error("Cannot delete last file");
      return;
    }
    const updatedFiles = files.filter((file) => file.name !== fileName);
    setFiles(updatedFiles);
    socket.emit("file-added", {
      roomId,
      files: updatedFiles,
    });

    // SWITCH ACTIVE FILE
    if (activeFile === fileName) {
      setActiveFile(updatedFiles[0].name);
    }
  };
  // FILE ICONS
  const getFileIcon = (language) => {
    switch (language) {
      case "javascript":
        return <FaJs color="#f7df1e" />;

      case "java":
        return <FaJava color="#f89820" />;

      case "python":
        return <FaPython color="#3776ab" />;

      case "cpp":
        return <SiCplusplus color="#659ad2" />;

      default:
        return <FiFileText color="#94a3b8" />;
    }
  };
  return (
    <div className="file-explorer">
      {/* HEADER */}
      <div className="file-header">
        <span>FILES</span>

        {currentUserRole !== "viewer" && (
          <button onClick={addFile}>+ New File</button>
        )}
      </div>

      {/* FILE LIST */}
      {files.map((file) => (
        <div
          key={file.name}
          className={
            activeFile === file.name ? "file-item active-file" : "file-item"
          }
          onClick={() => {
            setActiveFile(file.name);

            socket.emit("active-file-change", {
              roomId,
              activeFile: file.name,
            });
          }}
        >
          {/* FILE NAME */}
          <div className="file-name">
            <span className="file-icon">{getFileIcon(file.language)}</span>

            <span>{file.name}</span>
          </div>
          {/* ACTION BUTTONS */}
          {currentUserRole !== "viewer" && (
            <div className="file-actions">
              {/* RENAME */}
              <button
                className="rename-btn"
                onClick={(e) => {
                  e.stopPropagation();

                  renameFile(file.name);
                }}
              >
                <FiEdit2 />
              </button>

              {/* DELETE */}
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();

                  deleteFile(file.name);
                }}
              >
                <FiTrash2 />
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
export default FileExplorer;
