# CollabCode AI

A real-time collaborative coding platform that enables multiple developers to write, execute, and discuss code together in shared coding rooms.

## Features

### Real-Time Collaboration

* Multi-user coding rooms
* Live code synchronization using Socket.IO
* Real-time cursor and file updates
* Collaborative editing experience

### Multi-Language Code Execution

Supports:

* JavaScript
* Python
* Java
* C
* C++

Code execution is powered through a cloud execution service, enabling secure and scalable execution without requiring Docker on deployed environments.

### AI Coding Assistant

* Integrated AI chat panel
* Code explanations
* Debugging assistance
* Programming guidance

### Team Communication

* Live room chat
* Typing indicators
* Real-time user presence

### Role-Based Access Control

* Admin
* Editor
* Viewer

Admins can manage permissions for all room participants.

### Version Management

* Save code snapshots
* Track project versions
* Restore previous versions

### Authentication

* User registration
* Login and logout
* JWT-based authentication

---

## Tech Stack

### Frontend

* React.js
* React Router
* Socket.IO Client
* Monaco Editor
* CSS3

### Backend

* Node.js
* Express.js
* Socket.IO
* MongoDB
* Mongoose

### AI Integration

* Groq API

### Code Execution

* JDoodle API

### Deployment

* Frontend: Vercel
* Backend: Render
* Database: MongoDB Atlas

---

## Architecture

User → React Frontend → Express Backend → MongoDB

Real-Time Collaboration:
Socket.IO ↔ Shared Rooms ↔ Live Synchronization

Code Execution:
Frontend → Backend → JDoodle API → Execution Result

AI Assistance:
Frontend → Backend → Groq API → AI Response

---
## Installation

### Clone Repository

```bash
git clone https://github.com/Samridhi2714/CollabCode-AI.git
cd CollabCode-AI
```

### Backend Setup

```bash
cd Server
npm install
npm run dev
```

### Frontend Setup

```bash
cd client
npm install
npm start
```
---

## Future Improvements

* GitHub repository integration
* Collaborative whiteboard
* Video calling
* Room Storage in Database
* Project templates
* Competitive programming mode

---

## Author

Samridhi Bhatia

BCA Student | Full Stack Developer | Open Source Enthusiast

GitHub:
https://github.com/Samridhi2714
