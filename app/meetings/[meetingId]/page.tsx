"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Link2,
  Share2,
  Users,
} from "lucide-react";

import { Button } from "@/components/common/ww-button";
import { PageShell } from "@/components/common/page-shell";

const MOCK_MEETING = {
  name: "금요일 저녁 모임",
  status: "OPEN" as const,
  deadline: "2026년 8월 25일 23:59",
  participantCount: 4,
  participants: ["김민지", "이서준", "박지수", "최원형"],
};

export default function MeetingManagePage() {
  const router = useRouter();
  const params = useParams<{ meetingId: string }>();

  const meetingId = params.meetingId;

  const [copied, setCopied] = useState(false);

  const sharePath = `/join/${meetingId}`;

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}${sharePath}`;

    await navigator.clipboard.writeText(shareUrl);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="whenwe-app">
      <PageShell onHome={() => router.push("/")}>
        <div className="results-head">
          <div>
            <p className="flow-kicker">MEETING #{meetingId.toUpperCase()}</p>

            <h2>{MOCK_MEETING.name}</h2>

            <p className="muted-text">
              모임을 관리하고 참여 현황을 확인하세요.
            </p>
          </div>

          <span className="status open">조율 중</span>
        </div>

        <div className="review-box">
          <div>
            <span>
              <Clock3 />
              조율 마감일
            </span>

            <b>{MOCK_MEETING.deadline}</b>
          </div>

          <div>
            <span>
              <Users />
              현재 참여자
            </span>

            <b>{MOCK_MEETING.participantCount}명</b>
          </div>
        </div>

        <div className="notice">
          <CalendarDays />

          <span>
            <b>현재 일정을 조율하고 있어요.</b>
            <br />
            조율 마감 전까지 참여자들이 가능한 날짜와 시간을 제출하거나 수정할
            수 있어요.
          </span>
        </div>

        <section className="results-section">
          <div className="section-title">
            <div>
              <h3>공유 링크</h3>

              <p className="muted-text">이 링크를 친구들에게 보내주세요.</p>
            </div>

            <Share2 />
          </div>

          <div className="share-link">
            <span>/join/{meetingId}</span>

            <button
              type="button"
              onClick={handleCopyLink}
              aria-label="공유 링크 복사"
            >
              {copied ? <Check /> : <Copy />}
            </button>
          </div>

          {copied && <p className="muted-text">링크를 복사했어요.</p>}
        </section>

        <section className="results-section">
          <div className="section-title">
            <div>
              <h3>참여 현황</h3>

              <p className="muted-text">현재 응답을 제출한 참여자예요.</p>
            </div>

            <span>
              <Users />
              {MOCK_MEETING.participantCount}명
            </span>
          </div>

          <div className="review-box">
            {MOCK_MEETING.participants.map((participant, index) => (
              <div key={participant}>
                <span>{index + 1}</span>

                <b>{participant}</b>

                <span className="status confirmed">제출 완료</span>
              </div>
            ))}
          </div>
        </section>

        <Button
          className="full"
          onClick={() => router.push(`/meetings/${meetingId}/result`)}
        >
          현재 조율 결과 보기
          <ArrowRight />
        </Button>

        <Button
          variant="ghost"
          className="full"
          onClick={() => router.push("/dashboard")}
        >
          대시보드로 돌아가기
        </Button>

        <div className="notice">
          <Link2 />

          <span>
            현재는 mock 데이터를 사용하고 있으며, Supabase 연동 후 실제 참여
            현황으로 교체할 예정입니다.
          </span>
        </div>
      </PageShell>
    </div>
  );
}
