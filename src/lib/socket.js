import { io } from "socket.io-client";
import { showToast } from "./toast-utils";

let socket = null;
let adminSocket = null;

export const initSocket = () => {
  if (socket) return socket;
  
  socket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
    autoConnect: false,
    withCredentials: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  socket.on("support-notification", (data) => {
    console.log("Support notification:", data);
  });

  socket.on("new-message", (data) => {
    console.log("New message:", data);
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  return socket;
};

export const connectSocket = () => {
  if (socket && !socket.connected) {
    socket.connect();
  }
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    socket.disconnect();
  }
};

export const joinSupportRoom = (conversationId) => {
  if (socket) {
    socket.emit("join-support", { conversationId });
  }
};

export const sendSupportMessage = (conversationId, message, from = "user") => {
  if (socket) {
    socket.emit("support-message", { conversationId, message, from });
  }
};

export const notifyNewSupportRequest = (data) => {
  if (socket) {
    socket.emit("new-support-request", data);
  }
};

export const initAdminSocket = (onNotification) => {
  if (adminSocket) return adminSocket;
  
  adminSocket = io(import.meta.env.VITE_API_URL || "http://localhost:3000", {
    autoConnect: false,
  });

  adminSocket.on("connect", () => {
    console.log("Admin socket connected");
    adminSocket.emit("admin-auth", { role: "admin" });
  });

  adminSocket.on("support-notification", (data) => {
    console.log("Admin received notification:", data);
    if (onNotification) onNotification(data);
  });

  adminSocket.on("new-message", (data) => {
    console.log("Admin received message:", data);
  });

  adminSocket.connect();
  
  return adminSocket;
};

export const getSocket = () => socket;
export const getAdminSocket = () => adminSocket;