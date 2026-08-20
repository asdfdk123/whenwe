import type { TimeRange } from "@/lib/participant-session";

export const TIME_OPTIONS = Array.from({ length: 49 }, (_, index) => {
  const hour = Math.floor(index / 2);
  const minute = index % 2 === 0 ? "00" : "30";

  return `${String(hour).padStart(2, "0")}:${minute}`;
});

export function timeToMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);

  return hour * 60 + minute;
}

function minutesToTime(minutes: number) {
  const hour = Math.floor(minutes / 60);
  const minute = minutes % 60;

  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function normalizeTimeRanges(ranges: TimeRange[]): TimeRange[] {
  if (ranges.length === 0) {
    return [];
  }

  const sortedRanges = [...ranges]
    .map((range) => ({
      start: timeToMinutes(range.start),
      end: timeToMinutes(range.end),
    }))
    .sort((a, b) => a.start - b.start);

  const merged = [sortedRanges[0]];

  for (let index = 1; index < sortedRanges.length; index += 1) {
    const current = sortedRanges[index];
    const previous = merged[merged.length - 1];

    // 시간이 겹치거나 바로 이어지는 경우 하나의 시간대로 합침
    if (current.start <= previous.end) {
      previous.end = Math.max(previous.end, current.end);
      continue;
    }

    merged.push(current);
  }

  return merged.map((range) => ({
    start: minutesToTime(range.start),
    end: minutesToTime(range.end),
  }));
}
