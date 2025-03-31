// src/components/AdminNavTop.tsx
import React, { useState } from "react";
import { User, ChevronLeft, Users, Files, UploadCloud } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminNavTopProps {
  userName: string;
}

const AdminNavTop: React.FC<AdminNavTopProps> = ({ userName }) => {
  const navigate = useNavigate();
  const [isSideBarOpen, setSideBarOpen] = useState<boolean>(false);

  return (
    <>
      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 bg-[#06B8BE] text-white px-6 py-4 flex justify-between items-center shadow-md z-10">
        {/* Logo & Title */}
        <div className="flex items-center space-x-4">
          <button onClick={() => navigate("/")} className="w-auto h-10 cursor-pointer">
            <img src="/TheCICSLogo.png" alt="TheCICS Logo" className="w-auto h-10 object-contain" />
          </button>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        {/* Profile Button */}
        <button
          onClick={() => setSideBarOpen(!isSideBarOpen)}
          className="relative p-1.5 hover:bg-[#5CE1E6] rounded-full transition-colors overflow-hidden"
        >
          <User className="w-5 h-5" />
        </button>
      </nav>

      {/* Sidebar */}
      {isSideBarOpen && (
        <aside className="fixed top-0 left-0 w-64 h-full bg-gray-900 text-white z-20 shadow-lg">
          <div className="bg-violet-800 p-4 flex items-center justify-between">
            <img src="/TheCICSFullLogo.png" alt="TheCICS Full Logo" className="w-auto h-8 object-contain" />
            <button onClick={() => setSideBarOpen(false)} className="p-1 hover:bg-violet-700 rounded-full">
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>

          <div className="p-2">
            <div className="bg-gray-800 rounded-md p-3 mb-4">
              <p className="text-gray-400 text-xs mb-1">Logged in as</p>
              <p className="font-medium">{userName}</p>
              <p className="text-xs text-gray-400">Admin</p>
            </div>

            <ul className="space-y-1">
              <li>
                <button className="w-full p-2 flex items-center text-left rounded-md hover:bg-gray-800">
                  <Users className="w-5 h-5 mr-3 text-aqua-400" />
                  <span>User Management</span>
                </button>
              </li>
              <li>
                <button className="w-full p-2 flex items-center text-left rounded-md hover:bg-gray-800">
                  <Files className="w-5 h-5 mr-3 text-aqua-400" />
                  <span>Thesis Management</span>
                </button>
              </li>
              <li>
                <button className="w-full p-2 flex items-center text-left rounded-md hover:bg-gray-800">
                  <UploadCloud className="w-5 h-5 mr-3 text-aqua-400" />
                  <span>Thesis Upload</span>
                </button>
              </li>
            </ul>
          </div>
        </aside>
      )}

      {/* Overlay when sidebar is open */}
      {isSideBarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={() => setSideBarOpen(false)}></div>
      )}
    </>
  );
};

export default AdminNavTop;
