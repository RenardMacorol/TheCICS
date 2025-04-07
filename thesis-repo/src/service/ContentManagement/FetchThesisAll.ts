import { Fetchable } from '../Types/Fetchable';
import Thesis from '../Types/Thesis';
import { ThesisBase } from '../Class/ThesisBase';
import { supabase } from '../supabase';
export class FetchThesisAll extends ThesisBase implements Fetchable<Thesis>{
    async fetch(): Promise<Thesis[]> {
    const { data, error } = await supabase.from("Thesis").select("*");
        if(error){
            return this._thesis = [] 
        }
        return this._thesis = data
    }

}