import { createClient } from '@supabase/supabase-js';

const supabaseUrl ="https:/kiupsvuzemscpmbqqyrl.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtpdXBzdnV6ZW1zY3BtYnFxeXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk0NzA3OTEsImV4cCI6MjA1NTA0Njc5MX0.sM9QYouYKu4EKHAY7XENKp3acs0OPf8V7NJ7ktQzFP8"
if(!supabaseUrl || !supabaseAnonKey){
    throw new Error("Missing supabase environment variable");
}

export const supabase = createClient(supabaseUrl,supabaseAnonKey);