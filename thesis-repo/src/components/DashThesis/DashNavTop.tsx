import {Bell, Plus, Search, Settings, User } from "lucide-react"
const DashNavTop = () => {
    return(
    <nav className="bg-gray-300 px-6 py-3 flex justify-between items-center">
        <button className="text-xl font-bold">☰</button>
        <div className="flex items-center bg-white px-4 py-1 rounded-lg">
            <Search className="w-5 h-5 text-gray-500"/>
            <input type="text" placeholder="Search" className="ml-2 outline-none bg-transparent"/>
        </div>
        <div className="flex gap-3">
            <Settings className="w-6 h-6"/>
            <Plus className="w-6 h-6"/>
            <Bell className="w-6 h-6"/>
            <User className="w-6 h-6"/>
        </div>

    </nav>
    )

} 

export default DashNavTop;