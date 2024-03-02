import { createContext, useContext, type ReactNode } from "react";
import { io } from "socket.io-client";

const context = createContext<ReturnType<typeof io> | null>(null);

export const useSocketIO = () => {
  return useContext(context)!;
};

useSocketIO.Provider = ({
  socket,
  children,
}: {
  socket: ReturnType<typeof io>;
  children: ReactNode;
}) => {
  return <context.Provider value={socket}>{children}</context.Provider>;
};
