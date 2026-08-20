"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, Check, LockKeyhole } from "lucide-react";

import { Button } from "@/components/common/ww-button";
import { PageShell } from "@/components/common/page-shell";
import {
  getParticipantDraft,
  saveParticipantDraft,
} from "@/lib/participant-session";

export default function JoinMeetingPage() {
  const router = useRouter();
  const params = useParams<{ meetingId: string }>();

  const meetingId = params.meetingId;

  const [nickname, setNickname] = useState("");
  const [hasExistingResponse, setHasExistingResponse] = useState(false);

  useEffect(() => {
    const existingDraft = getParticipantDraft(meetingId);

    if (!existingDraft) {
      return;
    }

    setNickname(existingDraft.nickname);
    setHasExistingResponse(Boolean(existingDraft.submittedAt));
  }, [meetingId]);

  const handleNext = () => {
    const trimmedNickname = nickname.trim();

    if (!trimmedNickname) {
      return;
    }

    const existingDraft = getParticipantDraft(meetingId);

    saveParticipantDraft(meetingId, {
      nickname: trimmedNickname,

      // 기존 응답이 있으면 그대로 유지
      selectedDates: existingDraft?.selectedDates ?? [],

      availability: existingDraft?.availability ?? [],

      submittedAt: existingDraft?.submittedAt,
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

          {hasExistingResponse && (
            <div className="notice">
              <Check />

              <span>
                <b>이미 제출한 일정이 있어요.</b>
                <br />
                기존 일정을 확인하거나 수정할 수 있어요.
              </span>
            </div>
          )}

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

          {hasExistingResponse && (
            <Button
              variant="soft"
              className="full"
              onClick={() => router.push(`/join/${meetingId}/submitted`)}
            >
              제출한 일정 확인하기
              <ArrowRight />
            </Button>
          )}

          <Button
            className="full"
            onClick={handleNext}
            disabled={!nickname.trim()}
          >
            {hasExistingResponse ? "내 일정 수정하기" : "다음"}

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
