"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock3, Plus, X } from "lucide-react";

import { Button } from "@/components/common/ww-button";
import { PageShell } from "@/components/common/page-shell";
import {
  getParticipantDraft,
  saveParticipantDraft,
  type AvailabilityItem,
  type TimeRange,
} from "@/lib/participant-session";
import {
  normalizeTimeRanges,
  TIME_OPTIONS,
  timeToMinutes,
} from "@/lib/time-range";

function formatDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  const weekday = new Intl.DateTimeFormat("ko-KR", {
    weekday: "short",
  }).format(date);

  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekday})`;
}

export default function AvailabilityTimesPage() {
  const router = useRouter();
  const params = useParams<{ meetingId: string }>();

  const meetingId = params.meetingId;

  const [availability, setAvailability] = useState<AvailabilityItem[]>([]);

  const [activeDate, setActiveDate] = useState("");

  const [startTime, setStartTime] = useState("14:00");
  const [endTime, setEndTime] = useState("17:00");

  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const draft = getParticipantDraft(meetingId);

    if (!draft) {
      router.replace(`/join/${meetingId}`);
      return;
    }

    if (!draft.selectedDates.length) {
      router.replace(`/join/${meetingId}/availability`);
      return;
    }

    const initialAvailability = draft.selectedDates.map((date) => {
      const existing = draft.availability.find((item) => item.date === date);

      return (
        existing ?? {
          date,
          ranges: [],
        }
      );
    });

    setAvailability(initialAvailability);
    setActiveDate(draft.selectedDates[0]);
    setLoaded(true);
  }, [meetingId, router]);

  const activeAvailability = availability.find(
    (item) => item.date === activeDate,
  );

  const activeRanges = activeAvailability?.ranges ?? [];

  const saveAvailability = (nextAvailability: AvailabilityItem[]) => {
    setAvailability(nextAvailability);

    const draft = getParticipantDraft(meetingId);

    if (!draft) {
      return;
    }

    saveParticipantDraft(meetingId, {
      ...draft,
      availability: nextAvailability,
    });
  };

  const handleAddRange = () => {
    setErrorMessage("");

    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    if (startMinutes >= endMinutes) {
      setErrorMessage("종료 시간은 시작 시간보다 늦어야 해요.");
      return;
    }

    const newRange: TimeRange = {
      start: startTime,
      end: endTime,
    };

    const nextAvailability = availability.map((item) => {
      if (item.date !== activeDate) {
        return item;
      }

      return {
        ...item,
        ranges: normalizeTimeRanges([...item.ranges, newRange]),
      };
    });

    saveAvailability(nextAvailability);
  };

  const handleRemoveRange = (rangeIndex: number) => {
    const nextAvailability = availability.map((item) => {
      if (item.date !== activeDate) {
        return item;
      }

      return {
        ...item,
        ranges: item.ranges.filter((_, index) => index !== rangeIndex),
      };
    });

    saveAvailability(nextAvailability);
  };

  const allDatesCompleted =
    availability.length > 0 &&
    availability.every((item) => item.ranges.length > 0);

  const handleNext = () => {
    if (!allDatesCompleted) {
      return;
    }

    const draft = getParticipantDraft(meetingId);

    if (!draft) {
      router.replace(`/join/${meetingId}`);
      return;
    }

    saveParticipantDraft(meetingId, {
      ...draft,
      availability,
    });

    router.push(`/join/${meetingId}/review`);
  };

  if (!loaded) {
    return null;
  }

  return (
    <div className="whenwe-app">
      <PageShell step={2} onHome={() => router.push("/")}>
        <div className="flow-card wide">
          <div className="flow-kicker">STEP 2 OF 2</div>

          <h2>
            가능한 시간대를
            <br />
            알려주세요.
          </h2>

          <p className="muted-text">
            선택한 날짜마다 실제로 가능한 시간을 추가해주세요.
          </p>

          <div className="date-tabs">
            {availability.map((item) => {
              const completed = item.ranges.length > 0;

              return (
                <button
                  type="button"
                  key={item.date}
                  className={activeDate === item.date ? "active" : ""}
                  onClick={() => {
                    setActiveDate(item.date);
                    setErrorMessage("");
                  }}
                >
                  {formatDate(item.date)}

                  <small>
                    {completed ? (
                      <>
                        <Check />
                        {item.ranges.length}개 시간대
                      </>
                    ) : (
                      "아직 없음"
                    )}
                  </small>
                </button>
              );
            })}
          </div>

          <div className="time-picker">
            <div className="time-row">
              <Clock3 />

              <span>시작</span>

              <select
                className="ww-input"
                value={startTime}
                onChange={(event) => {
                  setStartTime(event.target.value);
                  setErrorMessage("");
                }}
              >
                {TIME_OPTIONS.slice(0, -1).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>

              <span>부터</span>

              <select
                className="ww-input"
                value={endTime}
                onChange={(event) => {
                  setEndTime(event.target.value);
                  setErrorMessage("");
                }}
              >
                {TIME_OPTIONS.slice(1).map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            {errorMessage && <p className="muted-text">{errorMessage}</p>}

            <Button variant="soft" onClick={handleAddRange}>
              <Plus />
              시간대 추가
            </Button>
          </div>

          <div className="range-list">
            {activeRanges.length === 0 ? (
              <p className="muted-text">아직 추가한 시간대가 없어요.</p>
            ) : (
              activeRanges.map((range, index) => (
                <div key={`${range.start}-${range.end}`}>
                  <span>
                    {range.start} – {range.end}
                  </span>

                  <button
                    type="button"
                    aria-label={`${range.start}부터 ${range.end} 시간대 삭제`}
                    onClick={() => handleRemoveRange(index)}
                  >
                    <X />
                  </button>
                </div>
              ))
            )}
          </div>

          {!allDatesCompleted && (
            <p className="muted-text">
              선택한 모든 날짜에 최소 하나의 시간대를 입력해주세요.
            </p>
          )}

          <Button
            variant="ghost"
            className="full"
            onClick={() => router.push(`/join/${meetingId}/availability`)}
          >
            <ArrowLeft />
            날짜 다시 선택하기
          </Button>

          <Button
            className="full"
            disabled={!allDatesCompleted}
            onClick={handleNext}
          >
            내 일정 확인하기
            <ArrowRight />
          </Button>
        </div>
      </PageShell>
    </div>
  );
}
