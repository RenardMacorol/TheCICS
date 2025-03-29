import { supabase } from '../api/supabase';

interface UserAccess{
    accessType: string
}

const restrictChecker = async (id:string): Promise<boolean> => {
   const {data, error} = await supabase.from("Users").select("accessType").eq("googleAuthID",id).single<UserAccess>() 

    if(data){
        console.log("User ID")
        console.log(data.accessType)
        return data.accessType !== "Active"
    }else
        console.log("There is something wront ", error)
        return true;

}

export default restrictChecker;