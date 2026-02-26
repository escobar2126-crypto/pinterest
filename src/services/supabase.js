import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://aqresughoplugmdfuzqq.supabase.co";
const supabaseAnonKey = "sb_publishable_xNyT7sK7Nx6O534HbjVlRw_Ejkzm8GH";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

