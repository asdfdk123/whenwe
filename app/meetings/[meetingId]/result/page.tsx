"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Info,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/common/ww-button";
import { PageShell } from "@/components/common/page-shell";
import { AvailabilityHeatmap } from "@/components/result/availability-heatmap";
import type { MeetingStatus, ScheduleCandidate } from "@/lib/meeting";

const MOCK_RESULT = {
  meetingName: "금요일 저녁 모임",

  responseCount: 4,
  totalParticipants: 5,

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

export default function OrganizerResultPage() {
  const router = useRouter();
  const params = useParams<{ meetingId: string }>();

  const meetingId = params.meetingId;

  /*
   * 현재는 Supabase 연결 전이므로 mock 상태입니다.
   *
   * OPEN       → 조율 중
   * CLOSED     → 조율 종료, 확정 가능
   * CONFIRMED  → 최종 일정 확정
   */
  const [status, setStatus] = useState<MeetingStatus>("OPEN");

  const [selectedCandidate, setSelectedCandidate] = useState<ScheduleCandidate>(
    MOCK_RESULT.recommendation,
  );

  const [confirmedSchedule, setConfirmedSchedule] =
    useState<ScheduleCandidate | null>(null);

  const candidates: ScheduleCandidate[] = [
    MOCK_RESULT.recommendation,
    ...MOCK_RESULT.alternatives,
  ];

  const handleConfirm = () => {
    if (status !== "CLOSED") {
      return;
    }

    setConfirmedSchedule(selectedCandidate);
    setStatus("CONFIRMED");
  };

  return (
    <div className="whenwe-app">
      <PageShell onHome={() => router.push("/")}>
        <div className="results-head">
          <div>
            <p className="flow-kicker">RESULTS · {meetingId.toUpperCase()}</p>

            <h2>{MOCK_RESULT.meetingName}</h2>

            <p className="muted-text">
              응답 {MOCK_RESULT.responseCount}명{" · "}
              참여자 {MOCK_RESULT.totalParticipants}명
            </p>
          </div>

          <span
            className={`status ${
              status === "CONFIRMED" ? "confirmed" : "open"
            }`}
          >
            {status === "OPEN" && "조율 중"}
            {status === "CLOSED" && "조율 마감"}
            {status === "CONFIRMED" && "확정됨"}
          </span>
        </div>

        {status === "OPEN" && (
          <div className="notice">
            <Info />

            <span>
              <b>아직 일정을 조율하고 있어요.</b>
              <br />
              조율 마감 전에는 참여자 응답이 변경될 수 있어 최종 일정을 확정할
              수 없어요.
            </span>
          </div>
        )}

        {status === "CLOSED" && (
          <div className="notice">
            <Check />

            <span>
              <b>일정 조율이 마감되었어요.</b>
              <br />
              결과를 비교한 뒤 최종 약속을 확정해주세요.
            </span>
          </div>
        )}

        {status === "CONFIRMED" && confirmedSchedule && (
          <div className="recommend">
            <div className="recommend-label">
              <Check />
              최종 확정 일정
            </div>

            <h3>
              {confirmedSchedule.date}
              <br />
              {confirmedSchedule.time}
            </h3>

            <p>
              <Users />
              {MOCK_RESULT.totalParticipants}명 중{" "}
              {confirmedSchedule.availableCount}명 가능
            </p>
          </div>
        )}

        {status !== "CONFIRMED" && (
          <div className="recommend">
            <div className="recommend-label">
              <Sparkles />
              가장 좋은 시간
            </div>

            <h3>
              {MOCK_RESULT.recommendation.date}
              <br />
              {MOCK_RESULT.recommendation.time}
            </h3>

            <p>
              <Users />
              {MOCK_RESULT.totalParticipants}명 중{" "}
              {MOCK_RESULT.recommendation.availableCount}명 가능
            </p>

            {status === "CLOSED" && (
              <Button
                onClick={() => setSelectedCandidate(MOCK_RESULT.recommendation)}
              >
                이 일정 선택
                <Check />
              </Button>
            )}
          </div>
        )}

        <section className="results-section">
          <div className="section-title">
            <div>
              <h3>시간별 가능 현황</h3>

              <p className="muted-text">진할수록 가능한 참여자가 많아요.</p>
            </div>

            <span>
              <Users />
              {MOCK_RESULT.responseCount}/{MOCK_RESULT.totalParticipants}
            </span>
          </div>

          <AvailabilityHeatmap
            rows={MOCK_RESULT.heatmap}
            totalParticipants={MOCK_RESULT.totalParticipants}
          />
        </section>

        <section className="alt-list">
          <h3>다른 후보 시간</h3>

          {MOCK_RESULT.alternatives.map((candidate, index) => {
            const selected =
              selectedCandidate.date === candidate.date &&
              selectedCandidate.time === candidate.time;

            return (
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
                  {candidate.availableCount}/{MOCK_RESULT.totalParticipants}명
                </strong>

                {status === "CLOSED" && (
                  <Button
                    variant={selected ? "soft" : "outline"}
                    onClick={() => setSelectedCandidate(candidate)}
                  >
                    {selected ? "선택됨" : "선택"}
                  </Button>
                )}
              </div>
            );
          })}
        </section>

        {status === "OPEN" && (
          <Button className="full" disabled>
            <Clock3 />
            조율 마감 후 확정할 수 있어요
          </Button>
        )}

        {status === "CLOSED" && (
          <Button className="full" onClick={handleConfirm}>
            <CalendarDays />이 일정으로 확정하기
          </Button>
        )}

        {status === "CONFIRMED" && (
          <div className="notice">
            <Check />

            <span>
              <b>약속이 확정되었어요.</b>
              <br />
              참가자는 공유 링크에서 확정된 일정을 확인할 수 있어요.
            </span>
          </div>
        )}

        <Button
          variant="ghost"
          className="full"
          onClick={() => router.push(`/meetings/${meetingId}`)}
        >
          <ArrowLeft />
          모임 관리로 돌아가기
        </Button>

        {/* Supabase 연결 전 상태 확인용 임시 UI */}
        <div className="notice">
          <Info />

          <span>
            <b>개발용 상태 전환</b>
            <br />
            Supabase 연결 후에는 조율 마감일과 DB 상태를 기준으로 자동
            처리됩니다.
          </span>
        </div>

        <div className="hero-actions">
          <Button
            variant="outline"
            onClick={() => {
              setStatus("OPEN");
              setConfirmedSchedule(null);
            }}
          >
            OPEN
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setStatus("CLOSED");
              setConfirmedSchedule(null);
            }}
          >
            CLOSED
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              setConfirmedSchedule(selectedCandidate);
              setStatus("CONFIRMED");
            }}
          >
            CONFIRMED
          </Button>
        </div>
      </PageShell>
    </div>
  );
}
