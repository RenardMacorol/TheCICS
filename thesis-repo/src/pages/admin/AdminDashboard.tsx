import { Routes, Route } from "react-router-dom";
import AdminNavTop from "../../components/dashboard/AdminNavTop";
import UserManagementPage from "./UserManagementPage";
import ThesisManagementPage from "./ThesisManagementPage";
import ThesisUploadPage from "./ThesisUploadPage";
import ThesisCommentsModeration from "./ThesisCommentsModeration";

const AdminDashboard = () => {
 

  return (
    <div className="pt-24 p-5">
      <AdminNavTop userName="Admin" />
      <Routes>
        <Route path="user-management" element={<UserManagementPage />} />
        <Route path="thesis-management" element={<ThesisManagementPage />} />
        <Route path="thesis-upload" element={<ThesisUploadPage />} />
        <Route path="comment-management" element={<ThesisCommentsModeration />} />
        <Route path="/" element={<UserManagementPage />} /> {/* Default route */}
      </Routes>
           </div>
  );








};

export default AdminDashboard;