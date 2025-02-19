import { useNavigate } from 'react-router-dom';
import Logout from '../service/Logout';
import { useState } from 'react';
const LogoutButton = () => {
    const navigate = useNavigate();
    const [loading,setLoading] = useState(false)
   const handleLogout = async () => {
    setLoading(true);
    await Logout();
    navigate('/Auth')
    console.log('User Logout Success')
   } 

   return(
        <button onClick={handleLogout} disabled={loading} className="px-5 py-2 bg-blue-500 tex-white rounded-lg 
        hover:bg-blue-601  disabled:bg-gray-400">
          {loading ? "Logging Out" : "Logout"}
        </button> 
   )
}

export default LogoutButton;