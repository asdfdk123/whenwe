import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CalendarDays, Clock3, Plus, Users } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user || user.is_anonymous) {
    redirect(`/login?next=${encodeURIComponent("/dashboard")}`);
  }

  const { data: meetings, error } = await supabase
    .from("meetings")
    .select("*")
    .eq("organizer_id", user.id)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("Dashboard meeting load error:", error);
  }

  return (
    <div className="whenwe-app">
      <main className="page-shell">
        <div className="dashboard-head">
          <div>
            <p className="flow-kicker">MY MEETINGS</p>

            <h2>내 모임</h2>

            <p className="muted-text">
              만든 모임의 조율 현황을 확인할 수 있어요.
            </p>
          </div>

          <Link href="/meetings/new" className="ww-button ww-primary">
            <Plus />새 모임
          </Link>
        </div>

        {!meetings || meetings.length === 0 ? (
          <div className="flow-card">
            <CalendarDays />

            <h3>아직 만든 모임이 없어요.</h3>

            <p className="muted-text">
              첫 모임을 만들고 참여 링크를 공유해보세요.
            </p>

            <Link href="/meetings/new" className="ww-button ww-primary">
              첫 모임 만들기
              <ArrowRight />
            </Link>
          </div>
        ) : (
          <div className="meeting-list">
            {meetings.map((meeting) => {
              const effectiveStatus =
                meeting.status === "CONFIRMED"
                  ? "CONFIRMED"
                  : new Date(meeting.coordination_deadline) <= new Date()
                    ? "CLOSED"
                    : "OPEN";

              const statusLabel = {
                OPEN: "조율 중",
                CLOSED: "조율 마감",
                CONFIRMED: "확정됨",
              }[effectiveStatus];

              const deadline = new Intl.DateTimeFormat("ko-KR", {
                month: "long",
                day: "numeric",
                timeZone: "Asia/Seoul",
              }).format(new Date(meeting.coordination_deadline));

              return (
                <Link
                  href={`/meetings/${meeting.public_code}`}
                  key={meeting.id}
                  className="meeting-card"
                >
                  <div>
                    <div className="meeting-card-top">
                      <span
                        className={`status ${
                          effectiveStatus === "CONFIRMED" ? "confirmed" : "open"
                        }`}
                      >
                        {statusLabel}
                      </span>

                      <span className="muted-text">#{meeting.public_code}</span>
                    </div>

                    <h3>{meeting.name}</h3>

                    <div className="meeting-meta">
                      <span>
                        <Clock3 />
                        {deadline} 마감
                      </span>
                    </div>
                  </div>

                  <ArrowRight />
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
