import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { admin_key, page = 1, page_size = 50, filter = "all" } = await req.json();

    const expectedKey = Deno.env.get("ADMIN_SECRET");
    if (!expectedKey || admin_key !== expectedKey) {
      return new Response(
        JSON.stringify({ error: "未授权访问" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get counts
    const { count: totalCount } = await supabase
      .from("verification_codes")
      .select("*", { count: "exact", head: true });

    const { count: usedCount } = await supabase
      .from("verification_codes")
      .select("*", { count: "exact", head: true })
      .eq("is_used", true);

    const { count: unusedCount } = await supabase
      .from("verification_codes")
      .select("*", { count: "exact", head: true })
      .eq("is_used", false);

    // Get paginated data
    const from = (page - 1) * page_size;
    const to = from + page_size - 1;

    let query = supabase
      .from("verification_codes")
      .select("id, code, is_used, used_at, created_at")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (filter === "used") query = query.eq("is_used", true);
    if (filter === "unused") query = query.eq("is_used", false);

    const { data, error } = await query;

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        codes: data,
        stats: { total: totalCount || 0, used: usedCount || 0, unused: unusedCount || 0 },
        page,
        page_size,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: "请求格式错误" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
