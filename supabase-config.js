window.SUPABASE_URL="https://llsbbyilvhbsoygnygob.supabase.co";
window.SUPABASE_PUBLISHABLE_KEY="sb_publishable_ivmy1jr37gcaxV16FQ0o6g_MJizL-Py";
window.createInteriorSupabase=function(){
  return window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
};
