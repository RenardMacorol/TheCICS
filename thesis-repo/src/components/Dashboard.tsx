import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../api/supabase';
import { User } from "@supabase/supabase-js";
import LogoutButton from "./LogOutButton";
const Dashboard = () => {
  const navigate = useNavigate();
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
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-96 text-center">
        <h1 className="text-2xl font-semibold mb-4">Welcome to the Dashboard, {user?.user_metadata?.full_name} </h1>
        <LogoutButton/>
        </div>
    </div>
  );

}

export default Dashboard;