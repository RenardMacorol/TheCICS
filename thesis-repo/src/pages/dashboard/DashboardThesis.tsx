import { useEffect, useState } from "react";
import { supabase } from '../../service/supabase';
import { User } from "@supabase/supabase-js";
import ContentList from "../../components/dashboard/ContentList";
import DashNavTop from '../../components/dashboard/DashNavTop';
import FilterButton from "../../components/dashboard/FilterButton";
//import restrictChecker from "../../service/UserHandler/RestrictChecker";
import ValidUser from '../../service/UserHandler/ValidUser';
import NewUser from "../../service/UserHandler/NewUser";
import InsertNewUser from "../../service/UserHandler/InsertNewUser";
interface FilterState {
  sort: string;
  year: string;
  keywords: string[];
}


const Dashboard = () => {
  const [userScannned, setUserScanned] = useState(false);
  const [, setUser] = useState<User |null>(null);
 // const [restrict, setRestrict] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    sort: 'newest',
    year: 'all',
    keywords: []
  });

  useEffect(() => {
    const handleUser = async () =>{
    const {data: {user}} = await supabase.auth.getUser();
      const validUser = new ValidUser();
      if(user && await validUser.isValidUser(user)){
        const newUserCheck = new NewUser();
        if(await newUserCheck.isNewUser(user)){
          const newUser = new InsertNewUser();
          newUser.insertNewUser(user)
        }
      //setRestrict(await restrictChecker(user.id))
      setUser(user);
      }
    }
    if(!userScannned){
    handleUser();
    setUserScanned(true)
    }


  }, [userScannned]);

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  return (
    <div className="bg-gray-100 min-h-screen text-white">
    <DashNavTop setSearchQuery={setSearchQuery} searchQuery={""}/>
    {/*{restrict ? 
    <p className="flex justify-center items-center font-bold text-5xl text-blue-500">You Are Restricted to this page Please Contact Support -Wonka</p> 
    :
    (
      <div>
    <FilterButton onFilterChange={handleFilterChange}/>
    <ContentList searchQuery={searchQuery} filters={filters}/>
      </div>
    )
    }*/}
    <div>
    <FilterButton onFilterChange={handleFilterChange}/>
    <ContentList searchQuery={searchQuery} filters={filters}/>
      </div>
  </div>
  );
};


export default Dashboard;

