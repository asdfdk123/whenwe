import { createClient } from "@/lib/supabase/server";

export default async function SupabaseTestPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <div style={{ padding: 40 }}>
      <h1>Supabase Connection Test</h1>

      <p>Connection: {error ? "ERROR" : "OK"}</p>

      <pre>
        {JSON.stringify(
          {
            user: user?.id ?? null,
            error: error?.message ?? null,
          },
          null,
          2,
        )}
      </pre>
    </div>
  );
}
