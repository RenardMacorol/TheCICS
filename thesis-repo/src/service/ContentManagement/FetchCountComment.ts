import { CommentBase } from "../Class/CommentBase";
import { supabase } from "../supabase";

export class countCommentByThesisID  extends CommentBase {
    async fetchCount(thesisID:number): Promise<number> { // Fetch theses
           const { count, error } = await supabase
            .from("comments")
            .select("*", { count: "exact", head: true })
            .eq("thesisID", thesisID);

            if (error) {
            console.error(`Error counting comments for thesisID ${count}:`, error);
                return 0;
            }
            // For each fetched thesis, count the comments and add the count to the thesis object
            
            return count ?? 0;

    }
     
}