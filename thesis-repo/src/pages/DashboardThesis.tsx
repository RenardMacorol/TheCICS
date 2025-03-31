import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from '../api/supabase';
import { User } from "@supabase/supabase-js";
import ContentList from "../components/DashThesis/ContentList";
import DashNavTop from '../components/DashThesis/DashNavTop';
import FilterButton from "../components/DashThesis/FilterButton";
import restrictChecker from "../service/UserHandler/RestrictChecker";
interface FilterState {
  sort: string;
  year: string;
  keywords: string[];
}


const Dashboard = () => {
  const navigate = useNavigate();
  const [, setUser] = useState<User |null>(null);
  const [restrict, setRestrict] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    sort: 'newest',
    year: 'all',
    keywords: []
  });

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user || !user.email?.endsWith("@neu.edu.ph")) {
        navigate("/", { state: { errorMessage: "PLEASE LOGIN USING YOUR INSTITUTIONAL EMAIL." } });
        return;
      }

      const fullname = user.user_metadata?.full_name || "User";

      const { error: insertError } = await supabase.from("Users").insert({
        userID: user.id,
        name: fullname,
        email: user.email,
        role: "Student",
        googleAuthID: user.id,
        profilePicture: user.user_metadata?.avatar_url,
        dateRegistered: new Date().toISOString()
      });

      if (insertError) console.error("Error inserting user:", insertError);
      setRestrict(await restrictChecker(user.id))

      setUser(user);
    };

    fetchUser();
  }, [navigate]);


  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-gray-100 min-h-screen text-white">
      <DashNavTop setSearchQuery={setSearchQuery} />
      <FilterButton onFilterChange={handleFilterChange} />
      <ContentList searchQuery={searchQuery} filters={filters} />
    </div>
  );
};


export default Dashboard;

{/*
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-101">
        <div className="bg-white shadow-lg rounded-lg p-7 w-96 text-center">
        <h0 className="text-2xl font-semibold mb-4">Welcome to the Dashboard, {user?.user_metadata?.full_name} </h1>
        <LogoutButton/>
        </div>
      </div>
    */}
