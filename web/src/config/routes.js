import Login from "../pages/Login";
import Home from "../pages/Home";
import DocumentDetails from "../pages/DocumentDetails";
import DoctorList from "../pages/Doctor/DoctorList";
import DoctorProfile from "../pages/Doctor/DoctorProfile";

export const routes = [
  {
    name: "login",
    path: "/login",
    exact: true,
    component: Login,
    private: false,
  },
  { name: "home", path: "/", exact: true, component: Home, private: true },
  {
    name: "documents",
    path: "/docs/:id",
    exact: true,
    component: DocumentDetails,
    private: true,
  },
  {
    name: "doctors",
    path: "/u",
    exact: true,
    component: DoctorList,
    private: true,
  },
  {
    name: "doctorprofile",
    path: "/u/:id",
    exact: true,
    component: DoctorProfile,
    private: true,
  },
];
