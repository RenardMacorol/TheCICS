import React, { useState } from "react";
import { Menu, ChevronLeft, Users, Files, UploadCloud, ArrowLeft, User} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AdminNavTopProps {
  userName: string;
}

const AdminNavTop: React.FC<AdminNavTopProps> = ({ userName }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);

  return (
    <>
      {/* Top Navbar */}
      <nav className="w-full fixed top-0 left-0 bg-[#06B8BE] text-white px-4 py-3 flex justify-between items-center shadow-md z-30">
        <div className="flex items-center space-x-3">
          {/* Hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-[#5CE1E6] transition"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
            <img
              src="/TheCICSLogo.png"
              alt="TheCICS Logo"
              className="h-10 object-contain"
            />

          <h1 className="text-xl md:text-2xl font-bold">Admin Dashboard</h1>
        </div>
        
         {/* Profile Button */}
       <button
          className="relative p-1.5 hover:bg-[#5CE1E6] rounded-full transition-colors overflow-hidden"
        >
          <User className="w-7 h-5" />
        </button>

      </nav>


      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 transform transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-[#06B8BE] p-4 flex items-center justify-between">
          <img
            src="/TheCICSFullLogo.png"
            alt="TheCICS Full Logo"
            className="h-8 object-contain"
          />
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 hover:bg-[#5CE1E6] rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3">
          <div className="bg-gray-800 rounded-md p-3 mb-4">
            <p className="text-gray-400 text-xs mb-1">Logged in as</p>
            <p className="font-medium">{userName}</p>
            <p className="text-xs text-gray-400">Admin</p>
          </div>

          <ul className="space-y-2">
            <li>
              <button className="w-full p-2 flex items-center rounded-md hover:bg-gray-800">
                <Users className="w-5 h-5 mr-3 text-aqua-400" />
                User Management
              </button>
            </li>
            <li>
              <button className="w-full p-2 flex items-center rounded-md hover:bg-gray-800">
                <Files className="w-5 h-5 mr-3 text-aqua-400" />
                Thesis Management
              </button>
            </li>
            <li>
              <button className="w-full p-2 flex items-center rounded-md hover:bg-gray-800">
                <UploadCloud className="w-5 h-5 mr-3 text-aqua-400" />
                Thesis Upload
              </button>
            </li>
            <li>
  <button
    onClick={() => navigate("/")} // ✅ Now navigates to home
    className="w-full p-2 flex items-center rounded-md hover:bg-gray-800"
  >
    <ArrowLeft className="w-5 h-5 mr-3 text-aqua-400" />
    Back to Dashboard
  </button>
</li>
          </ul>
        </div>
      </div>

      {/* Background Overlay when sidebar is open */}
      {isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="w-auto h-auto object-contain"
        />
      )}
    </>
  );
};

export default AdminNavTop;