import { supabase } from '../supabase';
import User from '../Types/User';
import { UserBase } from '../Class/UserBase';
import { Fetchable } from '../Types/Fetchable';

export class FetchUserAll extends UserBase implements Fetchable<User>{
    async fetch(): Promise<User[]>{
        console.log("Fetching users...");
        const { data, error } = await supabase.from("Users").select("*");
  
        if (error) {
            console.error("Error fetching users:", error);
            return this._user =  []
        } 
            console.log("✅ Fetched users:", data);
            return this._user = data;
    }
} 