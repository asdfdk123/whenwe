"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Info } from "lucide-react";

import { Button } from "@/components/common/ww-button";
import { PageShell } from "@/components/common/page-shell";
import { createClient } from "@/lib/supabase/client";

export default function CreateMeetingPage() {
  const router = useRouter();

  const [meetingName, setMeetingName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleCreate = async () => {
    const trimmedName = meetingName.trim();

    if (!trimmedName || !deadline || isCreating) {
      return;
    }

    setIsCreating(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      // 현재 로그인한 모임장 확인
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user || user.is_anonymous) {
        router.push(`/login?next=${encodeURIComponent("/meetings/new")}`);
        return;
      }

      // 선택한 날짜의 23:59:59까지 조율 가능
      const coordinationDeadline = new Date(`${deadline}T23:59:59`);

      if (Number.isNaN(coordinationDeadline.getTime())) {
        setErrorMessage("조율 마감일을 다시 확인해주세요.");
        return;
      }

      if (coordinationDeadline <= new Date()) {
        setErrorMessage("조율 마감일은 현재 시각 이후로 선택해주세요.");
        return;
      }

      const { data: meeting, error } = await supabase
        .from("meetings")
        .insert({
          organizer_id: user.id,
          name: trimmedName,
          coordination_deadline: coordinationDeadline.toISOString(),
        })
        .select("public_code")
        .single();

      if (error) {
        console.error("Meeting create error:", error);

        setErrorMessage("모임을 생성하지 못했어요. 잠시 후 다시 시도해주세요.");
        return;
      }

      router.push(`/meetings/${meeting.public_code}`);
    } catch (error) {
      console.error("Unexpected meeting create error:", error);

      setErrorMessage("모임을 생성하는 중 문제가 발생했어요.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="whenwe-app">
      <PageShell onHome={() => router.push("/")}>
        <div className="flow-card create-card">
          <div className="flow-kicker">NEW MEETING</div>

          <h2>
            새 모임을
            <br />
            만들어볼까요?
          </h2>

          <p className="muted-text">필요한 정보만 간단히 입력하면 돼요.</p>

          <label className="field-label" htmlFor="meeting-name">
            모임 이름
          </label>

          <input
            id="meeting-name"
            className="ww-input"
            placeholder="예: 금요일 저녁 모임"
            value={meetingName}
            maxLength={80}
            onChange={(event) => setMeetingName(event.target.value)}
          />

          <label className="field-label" htmlFor="coordination-deadline">
            조율 마감일
          </label>

          <input
            id="coordination-deadline"
            className="ww-input"
            type="date"
            value={deadline}
            onChange={(event) => setDeadline(event.target.value)}
          />

          <div className="notice">
            <Info />

            <span>
              <b>조율 마감일 안내</b>
              <br />
              참가자는 마감 전까지 가능한 날짜와 시간을 제출하거나 수정할 수
              있어요.
            </span>
          </div>

          {errorMessage && (
            <div className="notice">
              <Info />

              <span>{errorMessage}</span>
            </div>
          )}

          <Button
            className="full"
            disabled={!meetingName.trim() || !deadline || isCreating}
            onClick={handleCreate}
          >
            {isCreating ? "모임 만드는 중..." : "모임 만들기"}

            {!isCreating && <ArrowRight />}
          </Button>
        </div>
      </PageShell>
    </div>
  );
}
