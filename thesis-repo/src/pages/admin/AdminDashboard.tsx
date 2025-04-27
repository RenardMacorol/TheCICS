import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminNavTop from "../../components/dashboard/AdminNavTop";
import UserManagementPage from "./UserManagementPage";
import ThesisManagementPage from "./ThesisManagementPage";
import ThesisUploadPage from "./ThesisUploadPage";

const AdminDashboard = () => {
  return (
    <div className="pt-24 p-5">
      <AdminNavTop userName="Admin" />
      <Routes>
        <Route path="user-management" element={<UserManagementPage />} />
        <Route path="thesis-management" element={<ThesisManagementPage />} />
        <Route path="thesis-upload" element={<ThesisUploadPage />} />
        <Route path="/" element={<UserManagementPage />} /> {/* Default route */}
      </Routes>
    </div>
  );
};

export default AdminDashboard;