import { useState, useEffect, useRef } from "react";

function useEditor({
  socket,
  roomId,
  username,
  sidebarOpen,
}) {
  const [editorInstance, setEditorInstance] =
    useState(null);

  const [monacoInstance, setMonacoInstance] =
    useState(null);

  const [typingTimeout, setTypingTimeout] =
    useState(null);

  // IMPORTANT
  const editorRef = useRef(null);

  const userDecorations = useRef({});

  // ================= CURSOR COLORS =================

  const getCursorColor = (name) => {
    const colors = [
      "#ff4d4f",
      "#52c41a",
      "#1890ff",
      "#faad14",
      "#b37feb",
      "#13c2c2",
      "#ff6bbd",
      "#eb5624",
      "#0a1564",
      "#cff220",
    ];

    let total = 0;

    for (let i = 0; i < name.length; i++) {
      total += name.charCodeAt(i);
    }

    return colors[total % colors.length];
  };

  // ================= EDITOR MOUNT =================

  const handleEditorDidMount = (
    editor,
    monaco,
  ) => {
    editorRef.current = editor;

    setEditorInstance(editor);
    setMonacoInstance(monaco);

    setTimeout(() => {
      editor.layout();
      editor.focus();
    }, 100);

    // CURSOR TRACKING

    editor.onDidChangeCursorPosition(
      (e) => {
        socket.emit("cursor-move", {
          roomId,
          username,
          position: e.position,
        });
      },
    );

    // TYPING

    editor.onDidType(() => {
      socket.emit("typing", {
        roomId,
        username,
      });

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      const timeout = setTimeout(() => {
        socket.emit("stopTyping", {
          roomId,
          username,
        });
      }, 1000);

      setTypingTimeout(timeout);
    });
  };

  // ================= SIDEBAR RESIZE =================

  useEffect(() => {
    if (!editorInstance) return;

    const timeout = setTimeout(() => {
      editorInstance.layout();
      editorInstance.focus();
    }, 320);

    return () => clearTimeout(timeout);
  }, [sidebarOpen, editorInstance]);

  // ================= WINDOW RESIZE =================

  useEffect(() => {
    if (!editorInstance) return;

    const handleResize = () => {
      editorInstance.layout();
    };

    window.addEventListener(
      "resize",
      handleResize,
    );

    return () => {
      window.removeEventListener(
        "resize",
        handleResize,
      );
    };
  }, [editorInstance]);

  // ================= CURSOR SYNC =================

  useEffect(() => {
    if (!socket) return;

    socket.on(
      "cursor-update",
      ({
        username: otherUser,
        position,
      }) => {
        if (
          !editorInstance ||
          !monacoInstance
        ) {
          return;
        }

        if (otherUser === username)
          return;

        const color =
          getCursorColor(otherUser);

        const className =
          `remote-cursor-${otherUser}`;

        if (
          !document.getElementById(
            className,
          )
        ) {
          const style =
            document.createElement(
              "style",
            );

          style.id = className;

          style.innerHTML = `
            .${className} {
              border-left: 3px solid ${color};
              margin-left: -1px;
              height: 20px;
            }

            .${className}::after {
              content: "${otherUser}";
              position: absolute;
              top: -18px;
              left: 0;
              background: ${color};
              color: white;
              font-size: 10px;
              padding: 2px 4px;
              border-radius: 4px;
              white-space: nowrap;
            }
          `;

          document.head.appendChild(
            style,
          );
        }

        const oldDecorations =
          userDecorations.current[
            otherUser
          ] || [];

        const newDecorations =
          editorInstance.deltaDecorations(
            oldDecorations,
            [
              {
                range:
                  new monacoInstance.Range(
                    position.lineNumber,
                    position.column,
                    position.lineNumber,
                    position.column,
                  ),

                options: {
                  beforeContentClassName:
                    className,
                },
              },
            ],
          );

        userDecorations.current[
          otherUser
        ] = newDecorations;
      },
    );

    return () => {
      socket.off("cursor-update");
    };
  }, [
    socket,
    editorInstance,
    monacoInstance,
    username,
  ]);

  return {
    editorRef,
    editorInstance,
    monacoInstance,
    handleEditorDidMount,
  };
}

export default useEditor;