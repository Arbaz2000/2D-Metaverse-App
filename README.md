# 2D Metaverse App (MERN Stack)

## Overview
The 2D Metaverse app allows users to create and interact within a virtual office space. Users can move their avatars, send messages, make video calls, and customize their environment with a map builder.

## Features
- **CI/CD Pipeline**: Automated deployment with GitHub Actions & AWS.
- **2D Avatars & Movement**: Users can move avatars in real-time using WebSockets.
- **Messaging System**: Real-time chat stored in MongoDB with WebSockets (Socket.io).
- **Video & Audio Calls**: Free group calls (up to 10 users) using self-hosted Jitsi Meet.
- **User Management**: JWT authentication, roles, and profile management.
- **Map Builder**: Drag-and-drop UI with Konva.js for office layout customization.
- **Avatar Interactions**: Poke feature for notifications.
- **Containerization & PWA**: Dockerized app with PWA support for offline use.

## Additional Features
- **Screen Sharing & Whiteboard**
- **Customizable Avatars**
- **Office Room Permissions**
- **Live Status Indicators**
- **Achievements & Gamification**
- **Virtual Events & Meetings**
- **AI Chatbot Assistant**

## Tech Stack
- **Frontend**: React, Phaser.js (avatars), Konva.js (map builder), PWA
- **Backend**: Node.js, Express, MongoDB, Redis
- **Real-time Communication**: WebSockets (Socket.io)
- **Video Calls**: Self-hosted Jitsi Meet
- **Deployment**: AWS Amplify (frontend), EC2 (backend), NGINX
- **Containerization**: Docker, Kubernetes (future scaling)

## Setup & Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/Arbaz2000/2d-metaverse.git
   cd 2d-metaverse
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the development server:
   ```sh
   npm run dev
   ```
4. Start the backend server:
   ```sh
   cd backend
   npm run start
   ```

## Scaling Strategy
- **Redis for Caching & WebSockets** (integrated from the start)
- **Kafka for high-volume messaging** (future scaling)
- **Kubernetes for auto-scaling** (free-tier clusters initially)

## License
This project is licensed under the MIT License.

## Contribution
Feel free to open an issue or submit a pull request!

---
Let me know if you need modifications before pushing this to GitHub! 🚀

documention 
[PROJECT IDEAS.pdf](https://github.com/user-attachments/files/19407359/PROJECT.IDEAS_.1.pdf)
