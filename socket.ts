import { Socket } from "socket.io-client";
import io from "socket.io-client";

let socket: Socket;

export const initSocket = () => {
  socket = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`);

  socket.on("connect", () => {
    console.log("Connected to socket server");
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from socket server");
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    initSocket();
  }
  return socket;
};
