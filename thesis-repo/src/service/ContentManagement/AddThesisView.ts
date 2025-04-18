import { supabase } from "../supabase";
import { countViewByThesisID } from "./fetchCountView";

 export const AddViewer = async (user_id: string, thesisID: number) => {
    const { data: existingView, error: viewError } = await supabase
      .from("view")
      .select("*")
      .eq("user_id", user_id)  // Assuming userID is available
      .eq("thesisID", thesisID).maybeSingle()
  
    if (viewError) {
      console.error("Error checking view existence:", viewError);
      return null;
    }

    if(!existingView){
        const { error: insertError } = await supabase
        .from("view")
        .insert([{ user_id, thesisID }]); // Insert new view
  
      if (insertError) {
        console.error("Error adding view:", insertError);
      }
    }

    const countView = new  countViewByThesisID()
    const count =  await countView.fetchCount(thesisID)

    return count ?? 0; 
}