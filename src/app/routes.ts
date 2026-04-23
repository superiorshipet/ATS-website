import { createBrowserRouter } from "react-router";
import { Root } from "./pages/Root";
import { Home } from "./pages/Home";
import { Auth } from "./pages/Auth";
import { GraduatesHome } from "./pages/graduates/GraduatesHome";
import { CVBuilder } from "./pages/graduates/CVBuilder";
import { Jobs } from "./pages/graduates/Jobs";
import { Profile } from "./pages/graduates/Profile";
import { EmployersHome } from "./pages/employers/EmployersHome";
import { PostJob } from "./pages/employers/PostJob";
import { ManageJobs } from "./pages/employers/ManageJobs";
import { AdminDashboard } from "./pages/admin/AdminDashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Auth,
  },
  {
    path: "/home",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "graduates", Component: GraduatesHome },
      { path: "graduates/cv-builder", Component: CVBuilder },
      { path: "graduates/jobs", Component: Jobs },
      { path: "graduates/profile", Component: Profile },
      { path: "employers", Component: EmployersHome },
      { path: "employers/post-job", Component: PostJob },
      { path: "employers/manage-jobs", Component: ManageJobs },
      { path: "admin", Component: AdminDashboard },
    ],
  },
]);