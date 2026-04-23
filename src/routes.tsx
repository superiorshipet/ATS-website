import { createBrowserRouter } from "react-router-dom";
import { Root } from "./app/pages/Root";
import { Home } from "./app/pages/Home";
import { Auth } from "./app/pages/Auth";
import { GraduatesHome } from "./app/pages/graduates/GraduatesHome";
import { CVBuilder } from "./app/pages/graduates/CVBuilder";
import { Jobs } from "./app/pages/graduates/Jobs";
import { Profile as GraduateProfile } from "./app/pages/graduates/Profile";
import { Applications } from "./app/pages/graduates/Applications";
import { EmployersHome } from "./app/pages/employers/EmployersHome";
import { PostJob } from "./app/pages/employers/PostJob";
import { ManageJobs } from "./app/pages/employers/ManageJobs";
import { JobApplicants } from "./app/pages/employers/JobApplicants";
import { EditJob } from "./app/pages/employers/EditJob";
import { Profile as EmployerProfile } from "./app/pages/employers/Profile";
import { AdminDashboard } from "./app/pages/admin/AdminDashboard";
import React from 'react';

const ProtectedRoute = ({ children, allowedTypes = [] }: { children: React.ReactNode; allowedTypes?: string[] }) => {
  const userType = localStorage.getItem('user_type');
  const token = localStorage.getItem('token');
  
  if (!token) {
    window.location.href = '/';
    return null;
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(userType || '')) {
    if (userType === 'admin') {
      window.location.href = '/home/admin';
    } else if (userType === 'employer') {
      window.location.href = '/home/employers';
    } else {
      window.location.href = '/home/graduates';
    }
    return null;
  }
  
  return <>{children}</>;
};

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
      // Graduate routes
      { path: "graduates", Component: () => React.createElement(ProtectedRoute, { allowedTypes: ['graduate'] }, React.createElement(GraduatesHome)) },
      { path: "graduates/cv-builder", Component: () => React.createElement(ProtectedRoute, { allowedTypes: ['graduate'] }, React.createElement(CVBuilder)) },
      { path: "graduates/jobs", Component: () => React.createElement(ProtectedRoute, { allowedTypes: ['graduate'] }, React.createElement(Jobs)) },
      { path: "graduates/profile", Component: () => React.createElement(ProtectedRoute, { allowedTypes: ['graduate'] }, React.createElement(GraduateProfile)) },
      { path: "graduates/applications", Component: () => React.createElement(ProtectedRoute, { allowedTypes: ['graduate'] }, React.createElement(Applications)) },
      // Employer routes
      { path: "employers", Component: () => React.createElement(ProtectedRoute, { allowedTypes: ['employer'] }, React.createElement(EmployersHome)) },
      { path: "employers/post-job", Component: () => React.createElement(ProtectedRoute, { allowedTypes: ['employer'] }, React.createElement(PostJob)) },
      { path: "employers/manage-jobs", Component: () => React.createElement(ProtectedRoute, { allowedTypes: ['employer'] }, React.createElement(ManageJobs)) },
      { path: "employers/job-applicants/:jobId", Component: () => React.createElement(ProtectedRoute, { allowedTypes: ['employer'] }, React.createElement(JobApplicants)) },
      { path: "employers/edit-job/:jobId", Component: () => React.createElement(ProtectedRoute, { allowedTypes: ['employer'] }, React.createElement(EditJob)) },
      { path: "employers/profile", Component: () => React.createElement(ProtectedRoute, { allowedTypes: ['employer'] }, React.createElement(EmployerProfile)) },
      // Admin routes
      { path: "admin", Component: () => React.createElement(ProtectedRoute, { allowedTypes: ['admin'] }, React.createElement(AdminDashboard)) },
      { path: "admin/profile", Component: () => React.createElement(ProtectedRoute, { allowedTypes: ["admin"] }, React.createElement(AdminProfile)) },
    ],
  },
]);
import { Profile as AdminProfile } from "./app/pages/admin/Profile";
