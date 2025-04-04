import { supabase } from "../../api/supabase";
import { Fetchable } from "../../Interface/Fetchable";
import Thesis from '../Table/Thesis';

export class FetchThesis implements Fetchable<Thesis>{
    private _thesis!: Thesis[];
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

    get thesis(): Thesis[]{
        return this._thesis;
    }

}