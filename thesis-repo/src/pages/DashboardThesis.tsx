import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../api/supabase';
import { User } from "@supabase/supabase-js";
import ContentList from "../components/DashThesis/ContentList";
import DashNavTop from "../components/DashThesis/DashNavTop";
import FilterButton from "../components/DashThesis/FilterButton";
const Dashboard = () => {
  const navigate = useNavigate();
  const [, setUser] = useState<User |null>(null);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error||!user || !user.email?.endsWith("@neu.edu.ph")) {
        navigate("/"); // ✅ Redirect to login if not logged in
      }else{
      const fullname = user.user_metadata?.full_name || "User";
      const {error } = await supabase.from("Users").insert({
          userID: user.id,
          name: fullname,
          email: user.email,
          role: "Student",
          googleAuthID: user.id,
          profilePicture: null,
          dateRegistered: new Date().toISOString()
        })
        if(error) console.error("Error here", error)
        console.log("The User Creation was success")

      setUser(user);
      setLoading(false);
 
      }
      
   };

    fetchUser();
  }, [navigate]);

  

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900">
      <DashNavTop/>
      <FilterButton/>
      <ContentList/>
    </div>
);

}

export default Dashboard;
