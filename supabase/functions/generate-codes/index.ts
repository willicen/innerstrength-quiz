import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // exclude confusing chars: I,O,0,1
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { count, admin_key } = await req.json();

    // Simple admin protection
    const expectedKey = Deno.env.get("ADMIN_SECRET");
    if (!expectedKey || admin_key !== expectedKey) {
      return new Response(
        JSON.stringify({ error: "未授权访问" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const num = Math.min(Math.max(Number(count) || 100, 1), 10000);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Generate unique codes in batches of 1000
    const allCodes: string[] = [];
    const codeSet = new Set<string>();

    while (codeSet.size < num) {
      const code = generateCode();
      if (!codeSet.has(code)) {
        codeSet.add(code);
        allCodes.push(code);
      }
    }

    // Insert in batches of 1000 (Supabase limit)
    const batchSize = 1000;
    let inserted = 0;
    const errors: string[] = [];

    for (let i = 0; i < allCodes.length; i += batchSize) {
      const batch = allCodes.slice(i, i + batchSize).map((code) => ({ code }));
      const { error } = await supabase.from("verification_codes").insert(batch);
      if (error) {
        errors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
      } else {
        inserted += batch.length;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        generated: inserted,
        codes: allCodes,
        errors: errors.length > 0 ? errors : undefined,
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
