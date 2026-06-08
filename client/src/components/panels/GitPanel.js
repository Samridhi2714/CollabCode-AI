
function GitPanel({
  commitMessage,
  setCommitMessage,
  saveVersion,
  versions,
  restoreVersion,
  deleteVersion,
}) {
  return (
    <div className="git-panel">
      <input
        type="text"
        placeholder="Commit message"
        value={commitMessage}
        onChange={(e) =>
          setCommitMessage(e.target.value)
        }
      />
      <button 
      className="save-versions"
      onClick={saveVersion}>
        Save Version
      </button>
      <div className="version-history">
        {versions.map((version) => (
          <div
            key={version._id}
            className="version-card"
          >
            <p>
              <strong>
                {version.message}
              </strong>
            </p>
            <p>
              By: {version.committedBy}
            </p>
            <p>
              {new Date(
                version.createdAt
              ).toLocaleString()}
            </p>
            <p>
              Files Saved:
              {" "}
              {version.files?.length || 0}
            </p>
            <div className="version-buttons">

              <button
              className="restore-btn"
                onClick={() =>
                  restoreVersion(version.files)
                }
              >
                Restore
              </button>
              <button
                className="delete-btn"
                onClick={() =>
                  deleteVersion(version._id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GitPanel;