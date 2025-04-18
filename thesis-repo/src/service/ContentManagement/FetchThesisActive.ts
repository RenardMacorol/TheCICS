import { ThesisBase } from "../Class/ThesisBase";
import { supabase } from "../supabase";
import { Fetchable } from "../Types/Fetchable";
import Thesis from '../Types/Thesis';
import { countCommentByThesisID } from "./FetchCountComment";
import { CountViewByThesisID } from "./FetchCountView";

export class FetchThesisActive  extends ThesisBase implements Fetchable<Thesis>{
    async fetch(): Promise<Thesis[]> { // Fetch theses
            const { data: thesesData, error: thesesError } = await supabase
                .from("Thesis")
                .select("*")
                .eq('status', 'Active');
    
            if (thesesError) {
                console.error("Error fetching theses:", thesesError);
                return [];
            }

        const counterComment = new countCommentByThesisID();
        const counterView = new CountViewByThesisID();

        const thesesCountStats = await Promise.all(
            thesesData.map(async (thesis) => {
                const commentCount = await counterComment.fetchCount(thesis.thesisID);
                const viewCount = await counterView.fetchCount(thesis.thesisID);
                return {
                    ...thesis,
                    comments : commentCount ?? 0,// adds a new property
                    views : viewCount ?? 0// adds a new property
                };
            })
        );
        
        this._thesis = thesesCountStats;            
 

            console.log("All Fetched Theses with Comments:", this._thesis);
            return this._thesis;

    }
     
}

