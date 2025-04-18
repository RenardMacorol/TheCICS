import { ThesisBase } from "../Class/ThesisBase";
import { supabase } from "../supabase";
import { Fetchable } from "../Types/Fetchable";
import Thesis from '../Types/Thesis';
import { countCommentByThesisID } from "./FetchCountComment";

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

        const counter = new countCommentByThesisID();

        const thesesWithCommentCounts = await Promise.all(
            thesesData.map(async (thesis) => {
                const commentCount = await counter.fetchCount(thesis.thesisID);
                return {
                    ...thesis,
                    comments : commentCount ?? 0// adds a new property
                };
            })
        );
 
            // Optionally, log the final list of theses with comments

            this._thesis = thesesWithCommentCounts            
            console.log("All Fetched Theses with Comments:", this._thesis);
            return this._thesis;

    }
     
}

