import {Bell, CircleHelp, LogOut, Plus, Search, Settings, SunMoon, User } from "lucide-react"
import { useState } from "react";
import Logout from "../../service/Logout";
import { useNavigate } from 'react-router-dom';
const DashNavTop = () => {
    const navigate = useNavigate();
    const [isSideBarOpen, setSideBarOpen] = useState(false);
    const [isProfileOpen, setProfileOpen] = useState(false);
    const handleLogout = async () => {
        await Logout();
        navigate('/')
        console.log('User Logout Success')
    } 
    return(
    <nav className="bg-gray-300 px-6 py-3 flex justify-between items-center">
        <button onClick={()=>setSideBarOpen(!isSideBarOpen)}className="text-xl font-bold">
             ☰
        </button>
        <div className="flex items-center bg-white px-4 py-1 rounded-lg">
            <Search className="w-5 h-5 text-gray-500"/>
            <input type="text" placeholder="Search" className="ml-2 outline-none bg-transparent"/>
        </div>
        <div className="flex gap-3">
            <Plus className="w-6 h-6"/>
            <Bell className="w-6 h-6"/>
            <User onClick={() => setProfileOpen(!isProfileOpen)}className="w-6 h-6"/>
        </div >
        {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-500 text-white p-4 transition-transform ${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button onClick={() => setSideBarOpen(false)} className="mb-4">
            Back
        </button>
        <ul>
          <li className="p-2 hover:bg-gray-700">📌 Bookmark Thesis</li>
          <li className="p-2 hover:bg-gray-700">💡 Recommendations</li>
          <li className="p-2 hover:bg-gray-700">🔍 Saved Searches</li>
        </ul>
      </aside>
      {/* Profile Dropdown */}
      {isProfileOpen && (
        <div className="absolute right-4 top-12 bg-gray-300 shadow-lg rounded-md p-2 w-40">
          <ul className="text-black">
            <li className="p-2 border-b">👤 Profile</li>
            <li className="p-2 flex items-center"><Settings className="mr-2"/>Settings</li>
            <li className="p-2 flex items-center"><SunMoon className="mr-2"/>Apperance</li>
            <li className="p-2 flex items-center"><CircleHelp className="mr-2"/> Help & Support</li>
            {/* New Admin Panel Navigation */}
          <li
                        className="p-2 hover:bg-blue-700 cursor-pointer"
                        onClick={() => navigate('/admin')}
                    >
                        🛠️ Admin Panel
                    </li>
            <li className="p-2 flex items-center text-red-600">
                <LogOut className="mr-2"/> 
                <button onClick={handleLogout}>Log out</button>
                </li>
          </ul>
        </div>
      )}

    </nav>
    )

} 

export default DashNavTop;

