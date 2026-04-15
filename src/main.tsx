import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Dashboard from "./components/pages/Dashboard.tsx";
import Users from "./components/pages/user/Users.tsx";
import Register from "./components/pages/Register.tsx";
import Login from "./components/pages/Login.tsx";
import UserCreate from "./components/pages/user/UserCreate.tsx";
import UserEdite from "./components/pages/user/UserEdite.tsx";
import Roles from "./components/pages/roles/Roles.tsx";
import RoleCreate from "./components/pages/roles/RoleCreate.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, path: "/dashboard", element: <Dashboard /> },
      { path: "/users", element: <Users /> },
      { path: "/users/create", element: <UserCreate /> },
      { path: "/users/:id/edit", element: <UserEdite /> },
      { path: "/roles", element: <Roles /> },
      { path: "/roles/create", element: <RoleCreate /> },
    ],
  },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
