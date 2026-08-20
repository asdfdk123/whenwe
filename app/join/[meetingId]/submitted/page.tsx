"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Check, Edit3 } from "lucide-react";

import { Button } from "@/components/common/ww-button";
import { PageShell } from "@/components/common/page-shell";
import {
  getParticipantDraft,
  type ParticipantDraft,
} from "@/lib/participant-session";

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  const weekday = new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
  }).format(date);

  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`;
}

export default function SubmittedPage() {
  const router = useRouter();
  const params = useParams<{ meetingId: string }>();

  const meetingId = params.meetingId;

  const [draft, setDraft] = useState<ParticipantDraft | null>(null);

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const participantDraft = getParticipantDraft(meetingId);

    if (!participantDraft) {
      router.replace(`/join/${meetingId}`);
      return;
    }

    if (!participantDraft.submittedAt) {
      router.replace(`/join/${meetingId}/review`);
      return;
    }

    setDraft(participantDraft);
    setLoaded(true);
  }, [meetingId, router]);

  if (!loaded || !draft) {
    return null;
  }

  return (
    <div className="whenwe-app">
      <PageShell onHome={() => router.push("/")}>
        <div className="success-card">
          <div className="success-icon">
            <Check />
          </div>

          <h2>일정 제출 완료!</h2>

          <p>
            {draft.nickname}님의 가능한 일정이
            <br />
            저장되었어요.
          </p>

          <div className="review-box">
            <div>
              <span>가능한 날짜</span>
              <b>{draft.selectedDates.length}개</b>
            </div>

            {draft.availability.map((item) => (
              <div key={item.date}>
                <span>
                  <CalendarDays />
                  {formatDate(item.date)}
                </span>

                <b>
                  {item.ranges.map((range) => (
                    <span
                      key={`${range.start}-${range.end}`}
                      style={{ display: "block" }}
                    >
                      {range.start} – {range.end}
                    </span>
                  ))}
                </b>
              </div>
            ))}
          </div>

          <div className="notice">
            <Check />

            <span>
              <b>아직 수정할 수 있어요.</b>
              <br />
              조율 마감 전까지 가능한 날짜와 시간을 다시 수정할 수 있어요.
            </span>
          </div>

          <Button
            className="full"
            onClick={() => router.push(`/join/${meetingId}/result`)}
          >
            현재 결과 보기
            <ArrowRight />
          </Button>

          <Button
            variant="ghost"
            className="full"
            onClick={() => router.push(`/join/${meetingId}/availability`)}
          >
            <Edit3 />내 일정 수정하기
          </Button>
        </div>
      </PageShell>
    </div>
  );
}
