import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../api/supabase';
import { User } from "@supabase/supabase-js";
import ContentList from "../components/DashThesis/ContentList";
import DashNavTop from "../components/DashThesis/DashNavTop";
import FilterButton from "../components/DashThesis/FilterButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const [, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
      } else {
        navigate("/");
      }
    };
    fetchUser();
  }, [navigate]);

  return (
    <div className="bg-gray-100 min-h-screen text-gray-900">
      <DashNavTop />
      <FilterButton />
      <ContentList />
    </div>
  );
};

export default Dashboard;
