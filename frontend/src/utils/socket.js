import { io } from "socket.io-client";

const apiUrl =
  import.meta.env.VITE_NODE_ENV === "production"
    ? "https://polling-application-5lt2.onrender.com"
    : "https://polling-application-5lt2.onrender.com";

const socket = io(apiUrl);

export default socket;
