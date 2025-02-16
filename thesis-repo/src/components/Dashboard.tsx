import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logout from "../service/Logout";
import { supabase } from '../api/supabase';
import { User } from "@supabase/supabase-js";
const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const [user, setUser] = useState<User |null>(null);

  useEffect(() => {
    const fetchUser = async () =>{
      const {data:{user}} = await supabase.auth.getUser();
      if(user){
        setUser(user);
      } else {
        navigate("/")
      }
    }
    fetchUser()
  }, [navigate])
  
  const handleLogout = async () => {
    setloading(true);
    await Logout()
    navigate('/Auth')
    console.log("User Logout Sucess");
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h1 className="text-2xl font-semibold mb-4">Welcome to the Dashboard, {user?.user_metadata?.full_name} </h1>
        <button onClick={handleLogout} disabled={loading} className="px-4 py-2 bg-blue-500 tex-white rounded-lg 
        hover:bg-blue-600  disabled:bg-gray-400">
          {loading ? "Logging Out" : "Logout"}
        </button>
        </div>
    </div>
  );

}

export default Dashboard;