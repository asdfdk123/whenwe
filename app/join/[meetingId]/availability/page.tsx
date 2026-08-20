"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowRight, X } from "lucide-react";

import { Button } from "@/components/common/ww-button";
import { PageShell } from "@/components/common/page-shell";
import { DateCalendar } from "@/components/availability/date-calendar";
import {
  getParticipantDraft,
  saveParticipantDraft,
} from "@/lib/participant-session";

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  const weekday = new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
  }).format(date);

  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`;
}

export default function AvailabilityPage() {
  const router = useRouter();
  const params = useParams<{ meetingId: string }>();

  const meetingId = params.meetingId;

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const draft = getParticipantDraft(meetingId);

    if (!draft) {
      router.replace(`/join/${meetingId}`);
      return;
    }

    setSelectedDates(draft.selectedDates ?? []);
    setLoaded(true);
  }, [meetingId, router]);

  const removeDate = (date: string) => {
    setSelectedDates((current) => current.filter((item) => item !== date));
  };

  const handleNext = () => {
    if (!selectedDates.length) {
      return;
    }

    const draft = getParticipantDraft(meetingId);

    if (!draft) {
      router.replace(`/join/${meetingId}`);
      return;
    }

    const availability = selectedDates.map((date) => {
      const existing = draft.availability.find((item) => item.date === date);

      return (
        existing ?? {
          date,
          ranges: [],
        }
      );
    });

    saveParticipantDraft(meetingId, {
      ...draft,
      selectedDates,
      availability,
    });

    router.push(`/join/${meetingId}/availability/times`);
  };

  if (!loaded) {
    return null;
  }

  return (
    <div className="whenwe-app">
      <PageShell step={2} onHome={() => router.push("/")}>
        <div className="flow-card wide">
          <div className="flow-kicker">STEP 1 OF 2</div>

          <h2>
            가능한 날짜를
            <br />
            모두 선택해주세요.
          </h2>

          <p className="muted-text">
            실제로 만날 수 있는 날짜를 여러 개 선택할 수 있어요.
          </p>

          <DateCalendar selected={selectedDates} onChange={setSelectedDates} />

          {selectedDates.length > 0 && (
            <div className="selection-summary">
              <span>선택한 날짜 · {selectedDates.length}개</span>

              <div>
                {selectedDates.map((date) => (
                  <b key={date}>
                    {formatDate(date)}

                    <button
                      type="button"
                      onClick={() => removeDate(date)}
                      aria-label={`${formatDate(date)} 삭제`}
                    >
                      <X />
                    </button>
                  </b>
                ))}
              </div>
            </div>
          )}

          <Button
            className="full"
            onClick={handleNext}
            disabled={!selectedDates.length}
          >
            다음: 시간 선택
            <ArrowRight />
          </Button>
        </div>
      </PageShell>
    </div>
  );
}
