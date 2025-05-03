import { ViewBase } from "../Class/ViewBase";
import { supabase } from "../supabase";

export class CountLikeByThesisID  extends ViewBase {
    async fetchCount(thesisID:number): Promise<number> { // Fetch theses
           const { count, error } = await supabase
            .from("like")
            .select("*", { count: "exact", head: true })
            .eq("thesisID", thesisID);

            if (error) {
            console.error(`Error counting view for thesisID ${count}:`, error);
                return 0;
            }
            console.log(`${thesisID}:`,count)
            // For each fetched thesis, count the comments and add the count to the thesis object
            
            return count ?? 0;

    }
     
}