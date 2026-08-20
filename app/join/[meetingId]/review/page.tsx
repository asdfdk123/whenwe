"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Check, Send } from "lucide-react";

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

export default function ReviewPage() {
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

    if (!participantDraft.selectedDates.length) {
      router.replace(`/join/${meetingId}/availability`);
      return;
    }

    const hasIncompleteDate = participantDraft.availability.some(
      (item) => item.ranges.length === 0,
    );

    if (hasIncompleteDate) {
      router.replace(`/join/${meetingId}/availability/times`);
      return;
    }

    setDraft(participantDraft);
    setLoaded(true);
  }, [meetingId, router]);

  const handleSubmit = () => {
    if (!draft) {
      return;
    }

    // 아직 Supabase를 연결하지 않았으므로
    // 실제 서버 저장은 다음 단계에서 구현
    router.push(`/join/${meetingId}/submitted`);
  };

  if (!loaded || !draft) {
    return null;
  }

  return (
    <div className="whenwe-app">
      <PageShell step={3} onHome={() => router.push("/")}>
        <div className="flow-card">
          <div className="flow-kicker">마지막 확인</div>

          <h2>이렇게 제출할까요?</h2>

          <p className="muted-text">입력한 내용을 확인한 뒤 제출해주세요.</p>

          <div className="review-box">
            <div>
              <span>닉네임</span>
              <b>{draft.nickname}</b>
            </div>

            <div>
              <span>가능한 날짜</span>

              <b>{draft.selectedDates.map(formatDate).join(", ")}</b>
            </div>
          </div>

          <div className="review-box">
            {draft.availability.map((item) => (
              <div key={item.date}>
                <span>{formatDate(item.date)}</span>

                <b>
                  {item.ranges.map((range) => (
                    <span
                      key={`${range.start}-${range.end}`}
                      style={{
                        display: "block",
                      }}
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
              <b>제출 전 확인해주세요.</b>
              <br />
              조율 마감 전까지는 내 가능 일정을 수정할 수 있어요.
            </span>
          </div>

          <Button className="full" onClick={handleSubmit}>
            제출하기
            <Send />
          </Button>

          <Button
            variant="ghost"
            className="full"
            onClick={() => router.push(`/join/${meetingId}/availability/times`)}
          >
            <ArrowLeft />
            시간 수정하기
          </Button>
        </div>
      </PageShell>
    </div>
  );
}
