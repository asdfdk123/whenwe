export type MeetingStatus = "OPEN" | "CLOSED" | "CONFIRMED";

export type ScheduleCandidate = {
  date: string;
  time: string;
  availableCount: number;
};
