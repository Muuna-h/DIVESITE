import { createClient } from '@supabase/supabase-js'
import * as schema from "@shared/schema";
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase credentials in .env file");
}

export const supabase = createClient(supabaseUrl, supabaseKey);