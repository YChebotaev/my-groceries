import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import axios from "axios";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssVarsProvider } from "@mui/joy/styles";
import CssBaseline from "@mui/joy/CssBaseline";
import { io } from "socket.io-client";
import type { CreateSessionResult } from "@my-groceries/service/types";
import { useApiClient } from "./hooks/useApiClient";
import { useSocketIO } from "./hooks/useSocketIO";
import { HomePage } from "./pages/HomePage";
import { RenameListPage } from "./pages/RenameListPage";
import { GroceriesPage } from "./pages/GroceriesPage";
import { ShortagesPage } from "./pages/ShortagesPage";
import { JoinPage } from "./pages/JoinPage";
import { EditGroceryPage } from "./pages/EditGroceryPage";
import "./index.css";

const apiClient = axios.create({
  baseURL: import.meta.env["VITE_BACKEND_URL"],
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const queryClient = new QueryClient();
const reactRoot = ReactDOM.createRoot(document.getElementById("root")!);
let socket: ReturnType<typeof io>;

export const refresh = () => {
  const currentListId = localStorage.getItem("currentListId");

  const router = createBrowserRouter([
    {
      index: true,
      element: currentListId ? (
        <Navigate to={`/${currentListId}/groceries`} />
      ) : (
        <HomePage />
      ),
    },
    {
      path: "/join",
      element: <JoinPage />,
    },
    {
      path: "/:listId/rename",
      element: <RenameListPage />,
    },
    {
      path: "/:listId/groceries",
      element: <GroceriesPage />,
    },
    {
      path: "/:listId/groceries/:groceryId",
      element: <EditGroceryPage />,
    },
    {
      path: "/:listId/shortages",
      element: <ShortagesPage />,
    },
  ]);

  reactRoot.render(
    <React.StrictMode>
      <CssBaseline />
      <useApiClient.Provider apiClient={apiClient}>
        <useSocketIO.Provider socket={socket}>
          <QueryClientProvider client={queryClient}>
            <CssVarsProvider defaultMode="system">
              <RouterProvider router={router} />
            </CssVarsProvider>
          </QueryClientProvider>
        </useSocketIO.Provider>
      </useApiClient.Provider>
    </React.StrictMode>,
  );
};

const token = localStorage.getItem("token");

if (token == null) {
  apiClient
    .post<CreateSessionResult>("/users/session")
    .then(({ data: { token } }) => {
      socket = io(import.meta.env["VITE_BACKEND_URL"], { auth: { token } });

      localStorage.setItem("token", token);

      refresh();
    });
} else {
  socket = io(import.meta.env["VITE_BACKEND_URL"], { auth: { token } });

  refresh();
}
