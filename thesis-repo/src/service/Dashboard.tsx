import { useState } from "react";
import { supabase } from "../../supabase";
import { useNavigate } from "react-router-dom";
const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  
  const handleLogout = async () => {
    setloading(true);
      await supabase.auth.signOut();
      navigate('/Auth')
      console.log("User Logout Sucess");
  }
  return (
    <div>
        <h1>Welcome to the Dashboard</h1>
        <button onClick={handleLogout} disabled={loading}>
          {loading ? "Logging Out .... Did you know pro programmer dont use if Else?" : "Logout"}
        </button>
    </div>
  );

}

export default Dashboard;