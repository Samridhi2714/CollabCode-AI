const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");

const auth = require("./routes/auth");
const protectedRoutes = require("./routes/protected");
const versionRoutes = require("./routes/versionRoutes");
const executeRoutes = require("./routes/executeRoutes");
const http = require("http");
const { Server } = require("socket.io");
const aiRoutes = require("./routes/aiRoutes.js");
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE"],
  },
});
// ================= MIDDLEWARE =================
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  }),
);

// ================= ROUTES =================
app.use("/api/auth", auth);
app.use("/api", protectedRoutes);
app.use("/api/versions", versionRoutes);
app.use("/execute", executeRoutes);
app.get("/", (req, res) => {
  res.send("API is running...");
});
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    uptime: process.uptime(),
  });
});
app.use("/api/ai", aiRoutes);
// ================= MEMORY STORAGE =================

// All connected users
let users = {};
// Room code storage
let rooms = {};
// Room Roles
let roomRoles = {};
// ================= HELPER FUNCTION =================

function getUsersInRoom(roomId) {
  const roomUsers = [];

  const addedUsers = new Set();

  Object.values(users).forEach((user) => {
    // Prevent duplicates
    if (user.roomId === roomId && !addedUsers.has(user.username)) {
      roomUsers.push({
        username: user.username,
        role: user.role,
      });
      addedUsers.add(user.username);
    }
  });
  return roomUsers;
}

// ================= SOCKET =================

io.on("connection", (socket) => {
  // ================= JOIN ROOM =================
  socket.on("join-room", ({ roomId, username }) => {
    socket.join(roomId);
 
    // Remove old duplicate connection
    for (let id in users) {
      if (users[id].roomId === roomId && users[id].username === username) {
        delete users[id];
      }
    }
    if (!roomRoles[roomId]) {
      roomRoles[roomId] = {};
    }
    let role;
    // IF USER ALREADY HAD ROLE
    if (roomRoles[roomId][username]) {
      role = roomRoles[roomId][username];
    } else {
      // CHECK IF ADMIN ALREADY EXISTS
      const adminExists = Object.values(roomRoles[roomId]).includes("admin");
      // ONLY FIRST USER becomes admin
      if (!adminExists) {
        role = "admin";
      } else {
        role = "viewer";
      }
      // SAVE ROLE
      roomRoles[roomId][username] = role;
    }
    // Save user
    users[socket.id] = {
      roomId,
      username,
      role,
    };

    // Send updated users list
    io.to(roomId).emit("room-users", getUsersInRoom(roomId));

    // Send existing room code
    if (!rooms[roomId]) {
  rooms[roomId] = {
    files: [
      {
      name: "main.js",
      language: "javascript",
      content: "",
    },
  ],
  activeFile: "main.js",
  output: "",
  };
}
socket.emit("room-state", rooms[roomId]);
    // Notify others
    socket.to(roomId).emit("user-joined", `${username} joined the room`);
  });
  // ================= CODE SYNC =================
socket.on("code-change", ({ roomId, files }) => {
  const currentUser = users[socket.id];
  // Block viewers
  if (
    currentUser && currentUser.role === "viewer"
  ) {
    return;
  }
   // CREATE ROOM IF MISSING
    if (!rooms[roomId]) {
      rooms[roomId] = {
        files: [],
        activeFile: "main.js",
        output: "",
      };
    }
  // Save FULL files array
  rooms[roomId].files = files;
  // Broadcast full files
  socket.to(roomId).emit("code-update",rooms[roomId].files,);
});
  // ============== FILE UPDATE ===========
  socket.on("file-added", ({ roomId, files }) => {
  if(!rooms[roomId]) {
    rooms[roomId] = {
      files: [],
      activeFile: "main.js",
      output: "",
    };
  }
  rooms[roomId].files = files;
  io.to(roomId).emit("files-update",rooms[roomId].files);
});
  // ================= ACTIVE FILE =================
socket.on("active-file-change",({ roomId, activeFile }) => {
    if (!rooms[roomId]) return;
    rooms[roomId].activeFile = activeFile;

    socket.to(roomId).emit("active-file-updated",activeFile);
  }
);
  // ================= CHAT =================

  socket.on("send-message", ({ roomId, message }) => {
    const user = users[socket.id];
    if (!user) return;
    socket.to(roomId).emit("receive-message", {
      user: user.username,
      text: message,
    });
  });
  // ================= TYPING =================

  socket.on("typing", ({ roomId, username }) => {
    socket.to(roomId).emit("userTyping", { username });
  });

  socket.on("stopTyping", ({ roomId, username }) => {
    socket.to(roomId).emit("userStoppedTyping", { username });
  });
  // ================= CURSOR =================
  socket.on("cursor-move", ({ roomId, username, position }) => {
    socket.to(roomId).emit("cursor-update", {
      username,
      position,
    });
  });
  //================= LANGUAGE SYNC =================
  socket.on("languageChange", ({ roomId, lang }) => {
    socket.to(roomId).emit("languageChanged", lang);
  });

  // ================= CHANGE ROLE =================
socket.on("change-role",({
    roomId,
    targetUser,
    newRole,
  }) => {
    const currentUser = users[socket.id];
    // ONLY ADMIN
    if (
      !currentUser ||
      currentUser.role !== "admin"
    ) {
      return;
    }

    // UPDATE ACTIVE USERS
    for (let id in users) {
      if (
        users[id].roomId === roomId &&
        users[id].username === targetUser
      ) {
        users[id].role = newRole;
        io.to(id).emit("role-changed", {
  role: newRole,
});
      }
    }

    // UPDATE ROOM STORAGE
    if (!roomRoles[roomId]) {
      roomRoles[roomId] = {};
    }
    roomRoles[roomId][
      targetUser
    ] = newRole;

    // SEND UPDATED USERS
    io.to(roomId).emit("room-users",
      getUsersInRoom(roomId),
    );
  },
);
  // ==============EXECUTION RESULT====================
  socket.on( "execution-result",
  (result) => {
    socket.to(
      result.roomId
    ).emit(
      "receive-execution-result",
      result
    );
  }
);
  // ================= DISCONNECT =================
  socket.on("disconnect", () => {
    const user = users[socket.id];

    if (user && user.roomId) {
      const roomId = user.roomId;

      socket.to(roomId).emit("user-left", `${user.username} left the room`);

      // REMOVE USER
      delete users[socket.id];

      // GET UPDATED ROOM USERS
      const roomUsers = getUsersInRoom(roomId);
      // REMOVE USER ROLE ONLY IF USER FULLY LEFT ROOM
      const stillExists = Object.values(users).some(
        (u) => u.roomId === roomId && u.username === user.username,
      );
      if (!stillExists) {
        delete roomRoles[roomId][user.username];
      }
      // GET UPDATED USERS
      const updatedUsers = getUsersInRoom(roomId);
      // CHECK IF ANY ADMIN EXISTS
      const hasAdmin = updatedUsers.some((u) => u.role === "admin");
      // IF NO ADMIN → MAKE FIRST USER ADMIN
      if (!hasAdmin && updatedUsers.length > 0) {
        const newAdmin = updatedUsers[0].username;
        // UPDATE USERS OBJECT
        for (let id in users) {
          if (users[id].roomId === roomId && users[id].username === newAdmin) {
            users[id].role = "admin";
          }
        }
        // UPDATE ROOM ROLES
        roomRoles[roomId][newAdmin] = "admin";
      }
      // SEND UPDATED USERS
      io.to(roomId).emit("room-users", getUsersInRoom(roomId));
    }
  });
});
// ================= DATABASE =================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});