import { createBrowserRouter, RouterProvider } from "react-router-dom";
import DirectoryView from "./DirectoryView";
import Register from "./Register";
import "./App.css";
import Login from "./Login";
import UsersPage from "./AdminDashboard";
import Plans from "./Plans";
import ProfileDashboard from "./components/ProfileDashboard";
import AdminDashboard from "./AdminDashboard";
import ActionButtons from "./components/test";

const router = createBrowserRouter([
  {
    path: "/",
    element: <DirectoryView />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/users",
     element: <AdminDashboard/>,
  },
  {
    path: "/directory/:dirId",
    element: <DirectoryView />,
  },
  {
    path: "/subscriptions",
    element: <Plans />,
  },
  {
   path: "/profile",
   element: <ProfileDashboard/>,
 },
 {
   path: "/test",
   element: <ActionButtons/>,
 },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
