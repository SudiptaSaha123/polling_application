import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_NODE_ENV === "production"
  ? "https://polling-application-nopu.onrender.com"
  : "https://polling-application-nopu.onrender.com";

const socket = io(apiUrl);

export default socket; 