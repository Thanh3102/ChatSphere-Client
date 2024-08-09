import { getSession } from "next-auth/react";
import { Socket } from "socket.io-client";
import io from "socket.io-client";

let socket: Socket;

export const initSocket = () => {
  socket = io("http://localhost:3002");

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
