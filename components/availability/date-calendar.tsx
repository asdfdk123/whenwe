"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

type DateCalendarProps = {
  selected: string[];
  onChange: (dates: string[]) => void;
};

const MAX_SELECTABLE_DAYS = 60;

function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function DateCalendar({ selected, onChange }: DateCalendarProps) {
  const today = useMemo(() => startOfDay(new Date()), []);

  const maxDate = useMemo(() => {
    const date = new Date(today);
    date.setDate(date.getDate() + MAX_SELECTABLE_DAYS);

    return date;
  }, [today]);

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const cells = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    return [
      ...Array.from({ length: firstDay }, () => null),
      ...Array.from(
        { length: lastDate },
        (_, index) => new Date(year, month, index + 1),
      ),
    ];
  }, [currentMonth]);

  const currentMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  const maxMonthStart = new Date(maxDate.getFullYear(), maxDate.getMonth(), 1);

  const canGoPrevious = currentMonth.getTime() > currentMonthStart.getTime();

  const canGoNext =
    new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1,
    ).getTime() <= maxMonthStart.getTime();

  const changeMonth = (amount: number) => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + amount, 1),
    );
  };

  const toggleDate = (date: Date) => {
    const key = toDateKey(date);

    if (selected.includes(key)) {
      onChange(selected.filter((item) => item !== key));
      return;
    }

    onChange([...selected, key].sort());
  };

  return (
    <div className="calendar">
      <div className="calendar-head">
        <button
          type="button"
          className="icon-button"
          disabled={!canGoPrevious}
          onClick={() => changeMonth(-1)}
          aria-label="이전 달"
        >
          <ArrowLeft />
        </button>

        <strong>
          {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
        </strong>

        <button
          type="button"
          className="icon-button"
          disabled={!canGoNext}
          onClick={() => changeMonth(1)}
          aria-label="다음 달"
        >
          <ArrowRight />
        </button>
      </div>

      <div className="weekdays">
        <span>일</span>
        <span>월</span>
        <span>화</span>
        <span>수</span>
        <span>목</span>
        <span>금</span>
        <span>토</span>
      </div>

      <div className="calendar-grid">
        {cells.map((date, index) => {
          if (!date) {
            return <span key={`empty-${index}`} />;
          }

          const key = toDateKey(date);
          const picked = selected.includes(key);

          const unavailable =
            date.getTime() < today.getTime() ||
            date.getTime() > maxDate.getTime();

          const isToday = date.getTime() === today.getTime();

          return (
            <button
              key={key}
              type="button"
              disabled={unavailable}
              onClick={() => toggleDate(date)}
              className={`${picked ? "picked" : ""} ${
                unavailable ? "muted" : ""
              }`}
            >
              {date.getDate()}

              {isToday && <small>오늘</small>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
