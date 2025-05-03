import { CircleHelp, LogOut, Search, Settings, MoonStar, User, BookMarked, Bookmark, Lightbulb, ChevronLeft, Quote } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { supabase } from "../../service/supabase"; 
import Logout from "../../service/auth/Logout";

interface SearchProp {
  setSearchQuery: (query: string) => void;
  searchQuery: string;
}

const DashNavTop = ({ setSearchQuery, searchQuery }: SearchProp) => {
  const navigate = useNavigate();
  const [isSideBarOpen, setSideBarOpen] = useState(false);
  const [isProfileOpen, setProfileOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState<string | null>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userData, error: userError } = await supabase
            .from("Users")
            .select("name, role")
            .eq("userID", user.id)
            .single();

          if (!userError && userData) {
            setUserName(userData.name || "User");
            setUserRole(userData.role);
            
          }

     }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchProfilePicture = async () => {
      const data = await supabase.auth.getUser();
      if (!data) return;

      if (data) {
        setProfilePicture(data.data.user?.user_metadata?.avatar_url);
      }
    };

    fetchProfilePicture();
  }, []);

  const handleLogout = async () => {
    await Logout();
    navigate('/');
    console.log('User Logout Success');
  };

  
    const navigateToHome = () => {
    navigate('/');
  };

  const navigateToBookmarked = () => {
    navigate('/bookmarked');
    setSideBarOpen(false);
  };

    const handleProfileToggle = () => {
    setProfileOpen(prev => !prev);
  };

  return (
    <nav className="bg-violet-800 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div className="flex items-center">
        <button
          onClick={() => setSideBarOpen(!isSideBarOpen)}
          className="text-xl font-bold hover:bg-violet-700 p-2 rounded-full transition-colors"
        >
          ☰
        </button>
        <div className="ml-4 w-auto h-10 cursor-pointer" onClick={navigateToHome}>
          <img
            src="/TheCICSLogo.png"
            alt="TheCICS Logo"
            className="w-auto h-10 object-contain"
          />
        </div>
      </div>

      <div className="flex items-center bg-violet-700 px-4 py-2 rounded-lg border border-violet-600 w-1/3 max-w-md">
        <Search className="w-5 h-5 text-violet-300"/>
        <input
          type="text"
          placeholder="Search theses..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="ml-2 outline-none bg-transparent text-white placeholder-violet-300 w-full"
        />
      </div>
{/*
          <button
            onClick={handleNotificationsToggle} // Use the new handler
            className="relative p-1.5 hover:bg-violet-700 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5"/>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-400 text-violet-900 text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
*/}
      <div className="flex gap-4 items-center">
        
        <div className="relative">
          <button
            onClick={handleProfileToggle} // Use the new handler
            className="relative p-1.5 hover:bg-violet-700 rounded-full transition-colors overflow-hidden"
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
              <div className="bg-violet-800 text-white p-4">
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-violet-700 flex items-center justify-center mx-auto mb-2 overflow-hidden">
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
                  <p className="text-xs text-violet-200">Researcher</p>
                </div>
              </div>
              <ul className="text-gray-700">
                <li className="border-b">
                  <button
                    className="p-3 w-full text-left hover:bg-gray-50 flex items-center"
                    onClick={() => {
                      navigate('/profile');
                      setProfileOpen(false);
                    }}
                  >
                    <User className="mr-2 w-4 h-4" /> Profile
                  </button>
                </li>
                <li className="border-b">
                  <button className="p-3 w-full text-left hover:bg-gray-50 flex items-center">
                    <Settings className="mr-2 w-4 h-4"/> Settings
                  </button>
                </li>
                <li className="border-b">
                  <button className="p-3 w-full text-left hover:bg-gray-50 flex items-center">
                    <MoonStar className="mr-2 w-4 h-4"/> Appearance
                  </button>
                </li>
                <li className="border-b">
                  <button className="p-3 w-full text-left hover:bg-gray-50 flex items-center">
                    <CircleHelp className="mr-2 w-4 h-4"/> Help & Support
                  </button>
                </li>
                {userRole === "Admin" && (
                  <li className="border-b">
                    <button
                      className="p-3 w-full text-left hover:bg-gray-50 flex items-center"
                      onClick={() => navigate('/admin')}
                    >
                      <span className="mr-2">🛠️</span> Admin Panel
                    </button>
                  </li>
                )}
                <li>
                  <button
                    className="p-3 w-full text-left hover:bg-red-50 flex items-center text-red-600"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 w-4 h-4"/> Log out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white p-0 shadow-lg transition-transform z-20 ${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="bg-violet-800 p-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src="/TheCICSFullLogo.png"
              alt="TheCICS Full Logo"
              className="w-auto h-8 object-contain"
            />
          </div>
          <button
            onClick={() => setSideBarOpen(false)}
            className="p-1 hover:bg-violet-700 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="p-2">
          <div className="bg-gray-800 rounded-md p-3 mb-4">
            <p className="text-gray-400 text-xs mb-1">Logged in as</p>
            <p className="font-medium">{userName}</p>
            <p className="text-xs text-gray-400">Researcher</p>
          </div>

          <ul className="space-y-1">
           <li>
              <button
                className="w-full p-2 flex items-center text-left rounded-md hover:bg-gray-800"
                onClick={navigateToBookmarked}
              >
                <Bookmark className="w-5 h-5 mr-3 text-cyan-400" />
                <span>Bookmarked Theses</span>
              </button>
            </li>
            <li>
                <button
                className="w-full p-2 flex items-center text-left rounded-md hover:bg-gray-800"
                onClick={() => {
                    navigate('/citation-history');
                    setSideBarOpen(false);
                }}
                >
                <Quote className="w-5 h-5 mr-3 text-cyan-400" />
                <span>Citation History</span>
                </button>
            </li>
          
          </ul>
        </div>
      </aside>

      {/* Overlay when sidebar is open */}
      {isSideBarOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-10"
          onClick={() => setSideBarOpen(false)}
        ></div>
      )}
    </nav>
  );
};

export default DashNavTop;
