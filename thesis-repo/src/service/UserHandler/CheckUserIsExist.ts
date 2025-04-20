import { supabase } from "../supabase";

const checkUserIsExist = async (userID : string) =>{
    const {data , error} = await supabase.from("Users").select('*').eq('googleAuthID',userID).single()
    if(error){
        console.log("Error Fetching " ,error.message)
    }

    return !!data;
}

export default checkUserIsExist