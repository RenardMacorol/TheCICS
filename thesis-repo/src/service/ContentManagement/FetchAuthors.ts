import { AuthorBase } from "../Class/AuthorBase";
import { supabase } from "../supabase";
import { Author } from "../Types/Author";
import { Fetchable } from "../Types/Fetchable";




export class FetchAuthor  extends AuthorBase implements Fetchable<Author>{
    async fetch(): Promise<Author[]> { // Fetch theses
            const { data: authorData, error: authorError } = await supabase
                .from("Author")
                .select("*")
    
            if (authorError) {
                console.error("Error fetching theses:", authorError);
                return [];
            }
    
            this._author = authorData as Author[];            
            return this._author;

    }


}