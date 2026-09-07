"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogIn } from "lucide-react";

import { Button } from "@/components/common/ww-button";
import { PageShell } from "@/components/common/page-shell";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMessage("");

    const supabase = createClient();

    const redirectTo =
      `${window.location.origin}` + "/auth/callback?next=/dashboard";

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      setErrorMessage("Google 로그인을 시작하지 못했어요.");
      setLoading(false);
    }
  };

  return (
    <div className="whenwe-app">
      <PageShell onHome={() => router.push("/")}>
        <div className="flow-head">
          <p className="flow-kicker">ORGANIZER</p>

          <h2>로그인</h2>

          <p className="muted-text">
            모임을 만들고 관리하려면 Google 로그인이 필요해요.
          </p>
        </div>

        {errorMessage && <div className="notice">{errorMessage}</div>}

        <Button className="full" disabled={loading} onClick={handleGoogleLogin}>
          <LogIn />

          {loading ? "로그인 중..." : "Google로 계속하기"}
        </Button>
      </PageShell>
    </div>
  );
}
