import type { Database } from "@/lib/database.types";

export type MeetingStatus = Database["public"]["Enums"]["meeting_status"];

export type Meeting = Database["public"]["Tables"]["meetings"]["Row"];

export type Participant = Database["public"]["Tables"]["participants"]["Row"];

export type Availability = Database["public"]["Tables"]["availability"]["Row"];

export type ScheduleCandidate = {
  date: string;
  time: string;
  availableCount: number;
};
