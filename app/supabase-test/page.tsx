import { createClient } from "@/lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: meetings, error } = await supabase.from("meetings").select("*");

  return (
    <div style={{ padding: 40 }}>
      <h1>Supabase Test</h1>

      <pre>
        {JSON.stringify(
          {
            user: user?.id ?? null,
            meetings,
            error: error?.message ?? null,
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}
