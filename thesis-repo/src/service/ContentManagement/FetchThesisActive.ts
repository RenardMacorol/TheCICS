import { ThesisBase } from "../Class/ThesisBase";
import { supabase } from "../supabase";
import { Fetchable } from "../Types/Fetchable";
import Thesis from '../Types/Thesis';

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
    
            this._thesis = thesesData.map(thesis => ({
                ...thesis,
                authorName: `Author ${thesis.authorID}`,
                views: Math.floor(Math.random() * 500) + 50,
                likes: Math.floor(Math.random() * 100) + 5,
                comments: Math.floor(Math.random() * 20)
            }));
            return this._thesis;

    }


}