"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Edit3,
  Info,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/common/ww-button";
import { PageShell } from "@/components/common/page-shell";
import { AvailabilityHeatmap } from "@/components/result/availability-heatmap";
import {
  getParticipantDraft,
  type ParticipantDraft,
} from "@/lib/participant-session";

const MOCK_RESULT = {
  meetingName: "금요일 저녁 모임",

  status: "OPEN" as const,

  responseCount: 4,
  totalParticipants: 5,

  deadlineText: "조율 마감까지 2일",

  recommendation: {
    date: "8월 22일 (토)",
    time: "14:00 – 17:00",
    availableCount: 4,
  },

  alternatives: [
    {
      date: "8월 25일 (화)",
      time: "19:00 – 21:00",
      availableCount: 4,
    },
    {
      date: "8월 27일 (목)",
      time: "18:30 – 20:30",
      availableCount: 3,
    },
  ],

  heatmap: [
    {
      date: "8/22",
      counts: [1, 2, 2, 3, 3, 4, 4, 4, 3],
    },
    {
      date: "8/23",
      counts: [0, 1, 2, 2, 3, 3, 2, 2, 1],
    },
    {
      date: "8/25",
      counts: [1, 1, 2, 3, 3, 4, 4, 3, 2],
    },
    {
      date: "8/27",
      counts: [0, 1, 1, 2, 2, 3, 3, 3, 2],
    },
  ],
};

export default function ParticipantResultPage() {
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

  const result = MOCK_RESULT;

  return (
    <div className="whenwe-app">
      <PageShell onHome={() => router.push("/")}>
        <div className="results-head">
          <div>
            <p className="flow-kicker">MEETING #{meetingId.toUpperCase()}</p>

            <h2>{result.meetingName}</h2>

            <p className="muted-text">
              응답 {result.responseCount}명{" · "}
              {result.deadlineText}
            </p>
          </div>
        </div>

        <div className="notice">
          <Info />

          <span>
            <b>아직 일정을 조율하고 있어요.</b>
            <br />
            다른 참여자가 응답하거나 수정하면 현재 결과도 달라질 수 있어요.
          </span>
        </div>

        <div className="recommend">
          <div className="recommend-label">
            <Sparkles />
            현재 가장 많이 겹치는 시간
          </div>

          <h3>
            {result.recommendation.date}
            <br />
            {result.recommendation.time}
          </h3>

          <p>
            <Users />
            {result.totalParticipants}명 중{" "}
            {result.recommendation.availableCount}명 가능
          </p>

          <p className="muted-text">
            <Clock3 />
            조율이 끝나면 모임장이 최종 일정을 확정할 수 있어요.
          </p>
        </div>

        <section className="results-section">
          <div className="section-title">
            <div>
              <h3>시간별 가능 현황</h3>

              <p className="muted-text">진할수록 가능한 사람이 많아요.</p>
            </div>

            <span>
              <Users />
              {result.responseCount}/{result.totalParticipants}
            </span>
          </div>

          <AvailabilityHeatmap
            rows={result.heatmap}
            totalParticipants={result.totalParticipants}
          />
        </section>

        <section className="alt-list">
          <h3>현재 다른 후보 시간</h3>

          {result.alternatives.map((candidate, index) => (
            <div key={`${candidate.date}-${candidate.time}`}>
              <span>
                <b>{index + 2}</b>

                <span>
                  {candidate.date}
                  <br />
                  {candidate.time}
                </span>
              </span>

              <strong>
                {candidate.availableCount}/{result.totalParticipants}명
              </strong>
            </div>
          ))}
        </section>

        <div className="notice">
          <CalendarDays />

          <span>
            <b>{draft.nickname}님의 일정도 반영됐어요.</b>
            <br />
            조율 마감 전이라면 언제든 수정할 수 있어요.
          </span>
        </div>

        <Button
          className="full"
          onClick={() => router.push(`/join/${meetingId}/availability`)}
        >
          <Edit3 />내 일정 수정하기
        </Button>

        <Button
          variant="ghost"
          className="full"
          onClick={() => router.push(`/join/${meetingId}/submitted`)}
        >
          제출한 일정 확인하기
          <ArrowRight />
        </Button>
      </PageShell>
    </div>
  );
}
