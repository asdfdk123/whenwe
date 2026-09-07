"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Share2,
  Users,
} from "lucide-react";

import { Button } from "@/components/common/ww-button";
import { PageShell } from "@/components/common/page-shell";
import type { Meeting, MeetingStatus, Participant } from "@/lib/meeting";
import { createClient } from "@/lib/supabase/client";

export default function MeetingManagePage() {
  const router = useRouter();
  const params = useParams<{ meetingId: string }>();

  const meetingId = params.meetingId;

  const [meeting, setMeeting] = useState<Meeting | null>(null);

  const [participants, setParticipants] = useState<Participant[]>([]);

  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadMeeting = async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const supabase = createClient();

        /*
         * 모임장 페이지이므로
         * Google 로그인된 사용자만 접근 허용
         */
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user || user.is_anonymous) {
          router.replace(
            `/login?next=${encodeURIComponent(`/meetings/${meetingId}`)}`,
          );

          return;
        }

        /*
         * URL의 meetingId는 DB UUID가 아니라
         * public_code입니다.
         */
        const { data: meetingData, error: meetingError } = await supabase
          .from("meetings")
          .select("*")
          .eq("public_code", meetingId)
          .eq("organizer_id", user.id)
          .maybeSingle();

        if (meetingError) {
          console.error("Meeting load error:", meetingError);

          setErrorMessage("모임 정보를 불러오지 못했어요.");

          return;
        }

        if (!meetingData) {
          setErrorMessage("존재하지 않거나 접근할 수 없는 모임이에요.");

          return;
        }

        setMeeting(meetingData);

        /*
         * 해당 모임의 참가자 조회
         */
        const { data: participantData, error: participantError } =
          await supabase
            .from("participants")
            .select("*")
            .eq("meeting_id", meetingData.id)
            .order("created_at", {
              ascending: true,
            });

        if (participantError) {
          console.error("Participant load error:", participantError);

          setErrorMessage("참여 현황을 불러오지 못했어요.");

          return;
        }

        setParticipants(participantData ?? []);
      } catch (error) {
        console.error("Unexpected meeting load error:", error);

        setErrorMessage("모임 정보를 불러오는 중 문제가 발생했어요.");
      } finally {
        setLoading(false);
      }
    };

    void loadMeeting();
  }, [meetingId, router]);

  const handleCopyLink = async () => {
    const shareUrl = `${window.location.origin}` + `/join/${meetingId}`;

    try {
      await navigator.clipboard.writeText(shareUrl);

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Copy link error:", error);
    }
  };

  if (loading) {
    return (
      <div className="whenwe-app">
        <PageShell onHome={() => router.push("/")}>
          <div className="flow-card">
            <p className="muted-text">모임 정보를 불러오는 중...</p>
          </div>
        </PageShell>
      </div>
    );
  }

  if (!meeting || errorMessage) {
    return (
      <div className="whenwe-app">
        <PageShell onHome={() => router.push("/")}>
          <div className="flow-card">
            <h2>모임을 확인할 수 없어요.</h2>

            <p className="muted-text">
              {errorMessage || "모임 정보를 찾지 못했어요."}
            </p>

            <Button className="full" onClick={() => router.push("/dashboard")}>
              대시보드로 돌아가기
            </Button>
          </div>
        </PageShell>
      </div>
    );
  }

  const effectiveStatus: MeetingStatus =
    meeting.status === "CONFIRMED"
      ? "CONFIRMED"
      : new Date(meeting.coordination_deadline) <= new Date()
        ? "CLOSED"
        : "OPEN";

  const submittedParticipants = participants.filter(
    (participant) => participant.submitted_at !== null,
  );

  const formattedDeadline = new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Seoul",
  }).format(new Date(meeting.coordination_deadline));

  const statusLabel = {
    OPEN: "조율 중",
    CLOSED: "조율 마감",
    CONFIRMED: "확정됨",
  }[effectiveStatus];

  return (
    <div className="whenwe-app">
      <PageShell onHome={() => router.push("/")}>
        <div className="results-head">
          <div>
            <p className="flow-kicker">
              MEETING #{meeting.public_code.toUpperCase()}
            </p>

            <h2>{meeting.name}</h2>

            <p className="muted-text">
              모임을 관리하고 참여 현황을 확인하세요.
            </p>
          </div>

          <span
            className={`status ${
              effectiveStatus === "CONFIRMED" ? "confirmed" : "open"
            }`}
          >
            {statusLabel}
          </span>
        </div>

        <div className="review-box">
          <div>
            <span>
              <Clock3 />
              조율 마감일
            </span>

            <b>{formattedDeadline}</b>
          </div>

          <div>
            <span>
              <Users />
              응답 완료
            </span>

            <b>{submittedParticipants.length}명</b>
          </div>
        </div>

        {effectiveStatus === "OPEN" && (
          <div className="notice">
            <CalendarDays />

            <span>
              <b>현재 일정을 조율하고 있어요.</b>
              <br />
              조율 마감 전까지 참여자들이 가능한 날짜와 시간을 제출하거나 수정할
              수 있어요.
            </span>
          </div>
        )}

        {effectiveStatus === "CLOSED" && (
          <div className="notice">
            <Clock3 />

            <span>
              <b>일정 조율이 마감되었어요.</b>
              <br />
              참여 결과를 확인한 뒤 최종 일정을 확정해주세요.
            </span>
          </div>
        )}

        {effectiveStatus === "CONFIRMED" && (
          <div className="notice">
            <Check />

            <span>
              <b>최종 일정이 확정되었어요.</b>
              <br />
              참가자는 공유 링크에서 확정된 일정을 확인할 수 있어요.
            </span>
          </div>
        )}

        <section className="results-section">
          <div className="section-title">
            <div>
              <h3>공유 링크</h3>

              <p className="muted-text">이 링크를 참여자에게 보내주세요.</p>
            </div>

            <Share2 />
          </div>

          <div className="share-link">
            <span>/join/{meeting.public_code}</span>

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

              <p className="muted-text">현재 모임에 참여한 사람들이에요.</p>
            </div>

            <span>
              <Users />
              {submittedParticipants.length}/{participants.length}
            </span>
          </div>

          {participants.length === 0 ? (
            <div className="notice">
              <Users />

              <span>
                <b>아직 참여자가 없어요.</b>
                <br />
                공유 링크를 보내 첫 응답을 받아보세요.
              </span>
            </div>
          ) : (
            <div className="review-box">
              {participants.map((participant, index) => (
                <div key={participant.id}>
                  <span>{index + 1}</span>

                  <b>{participant.nickname}</b>

                  <span
                    className={`status ${
                      participant.submitted_at ? "confirmed" : "open"
                    }`}
                  >
                    {participant.submitted_at ? "제출 완료" : "작성 중"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <Button
          className="full"
          onClick={() => router.push(`/meetings/${meeting.public_code}/result`)}
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
      </PageShell>
    </div>
  );
}
