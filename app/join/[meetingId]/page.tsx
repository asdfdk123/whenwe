"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, LockKeyhole } from "lucide-react";

import { Button } from "@/components/common/ww-button";
import { PageShell } from "@/components/common/page-shell";
import { saveParticipantDraft } from "@/lib/participant-session";

export default function JoinMeetingPage() {
  const router = useRouter();
  const params = useParams<{ meetingId: string }>();

  const meetingId = params.meetingId;

  const [nickname, setNickname] = useState("");

  const handleNext = () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      return;
    }

    saveParticipantDraft(meetingId, {
      nickname: trimmedNickname,
      selectedDates: [],
      availability: [],
    });

    router.push(`/join/${meetingId}/availability`);
  };

  return (
    <div className="whenwe-app">
      <PageShell step={1} onHome={() => router.push("/")}>
        <div className="flow-card">
          <div className="flow-kicker">MEETING #{meetingId.toUpperCase()}</div>

          <h2>금요일 저녁 모임</h2>

          <p className="muted-text">친구들과의 다음 만남 시간을 정해봐요.</p>

          <label className="field-label" htmlFor="nickname">
            닉네임을 입력해주세요
          </label>

          <input
            id="nickname"
            className="ww-input"
            placeholder="예: 김민지"
            value={nickname}
            onChange={(event) => setNickname(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                handleNext();
              }
            }}
          />

          <Button
            className="full"
            onClick={handleNext}
            disabled={!nickname.trim()}
          >
            다음
            <ArrowRight />
          </Button>

          <p className="privacy">
            <LockKeyhole />
            입력한 닉네임은 일정 참여자에게만 보여요.
          </p>
        </div>
      </PageShell>
    </div>
  );
}
