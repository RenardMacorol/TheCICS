import { supabase } from "../../../api/supabase"

const checkUserIsExist = async (userID : string) =>{
    const {data , error} = await supabase.from("Users").select('userID').eq('userID',userID).single()
    if(error){
        console.log("Error Fetching " ,error.message)
    }

    return !!data;
}

export default checkUserIsExist