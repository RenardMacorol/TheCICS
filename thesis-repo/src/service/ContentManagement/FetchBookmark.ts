import { supabase } from "../supabase";
import { Fetchable } from "../Types/Fetchable";

export class FetchBookmark implements Fetchable<string>{
    private _bookmarks! :string[]

    async fetch(): Promise<string[]> {
        const { data: userData, error: userError } = await supabase.auth.getUser();
            
            if (userError || !userData.user) {
                console.error("Error fetching user:", userError);
                return [];
            }
        
            const userID = userData.user.id;
            const { data, error } = await supabase
                .from("UserBookmarks")
                .select("thesisID") 
                .eq("userID", userID);
        
            if (error) {
                console.error("Error fetching bookmarks:", error);
                return [];
            }
        this._bookmarks = data.map(item => item.thesisID)
        return this._bookmarks
        
    }

    get bookmarks(): string[]{
        return this._bookmarks;
    }
}