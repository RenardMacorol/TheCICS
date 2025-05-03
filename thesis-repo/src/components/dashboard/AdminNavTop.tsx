// AdminNavTop.tsx
import React, { useState, useEffect } from "react";
import { Menu, ChevronLeft, Users, Files, UploadCloud, ArrowLeft, User,  LogOut,  MessageSquareMore } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../service/supabase";
import Logout from "../../service/auth/Logout";



interface AdminNavTopProps {
  userName: string;
}

const AdminNavTop: React.FC<AdminNavTopProps> = ({ userName: propUserName }) => {
  const navigate = useNavigate();
  const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState(propUserName);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserName(user.user_metadata?.full_name || propUserName || "User");

      
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const { data } = await supabase.auth.getUser();
      if (data) {
        setProfilePicture(data.user?.user_metadata?.avatar_url);
      }
    };

    fetchProfilePicture();
  }, []);

  const handleLogout = async () => {
    await Logout();
    navigate('/');
    console.log('User Logout Success');
  };

    const handleProfileToggle = () => {
    setProfileOpen(prev => !prev);
  };

  return (
    <>
      {/* Top Navbar */}
      <nav className="w-full fixed top-0 left-0 bg-[#06B8BE] text-white px-4 py-3 flex justify-between items-center z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-md hover:bg-[#5CE1E6] transition"
          >
            <Menu className="w-6 h-6" />
          </button>

          <img
            src="/TheCICSLogo.png"
            alt="TheCICS Logo"
            className="h-10 object-contain"
          />

          <h1 className="text-xl md:text-2xl font-bold">Admin Dashboard</h1>
        </div>

        <div className="flex gap-4 items-center">
            <div className="relative">
            <button
              onClick={handleProfileToggle}
              className="relative p-1.5 hover:bg-[#5CE1E6] rounded-full transition-colors overflow-hidden"
            >
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt="Profile"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 bg-white text-gray-800 shadow-lg rounded-md overflow-hidden z-10 w-56">
                <div className="bg-[#06B8BE] text-white p-4">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-full bg-cyan-700 flex items-center justify-center mx-auto mb-2 overflow-hidden">
                      {profilePicture ? (
                        <img
                          src={profilePicture}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-8 h-8 text-white" />
                      )}
                    </div>
                    <p className="font-medium">{userName}</p>
                    <p className="text-xs text-cyan-200">Admin</p>
                  </div>
                </div>
                <ul className="text-gray-700">
                  
                  <li>
                    <button
                      className="p-3 w-full text-left hover:bg-red-50 flex items-center text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 w-4 h-4" /> Log out
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
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
              <button
                className="w-full p-2 flex items-center rounded-md hover:bg-gray-800"
                onClick={() => {
                  navigate("/admin/user-management");
                  setSidebarOpen(false);
                }}
              >
                <Users className="w-5 h-5 mr-3 text-aqua-400" />
                User Management
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 flex items-center rounded-md hover:bg-gray-800"
                onClick={() => {
                  navigate("/admin/thesis-management");
                  setSidebarOpen(false);
                }}
              >
                <Files className="w-5 h-5 mr-3 text-aqua-400" />
                Thesis Management
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 flex items-center rounded-md hover:bg-gray-800"
                onClick={() => {
                  navigate("/admin/thesis-upload");
                  setSidebarOpen(false);
                }}
              >
                <UploadCloud className="w-5 h-5 mr-3 text-aqua-400" />
                Thesis Upload
              </button>
            </li>
            <li>
              <button
                className="w-full p-2 flex items-center rounded-md hover:bg-gray-800"
                onClick={() => {
                  navigate("/admin/comment-management");
                  setSidebarOpen(false);
                }}
              >
                <MessageSquareMore className="w-5 h-5 mr-3 text-aqua-400" />
                Comment Moderation
              </button>
            </li>


            <li>
              <button
                onClick={() => navigate("/")}
                className="w-full p-2 flex items-center rounded-md hover:bg-gray-800"
              >
                <ArrowLeft className="w-5 h-5 mr-3 text-aqua-400" />
                Back to Dashboard
              </button>
            </li>
          </ul>
        </div>
      </div>

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