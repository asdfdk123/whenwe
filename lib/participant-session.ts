export type TimeRange = {
  start: string;
  end: string;
};

export type AvailabilityItem = {
  date: string;
  ranges: TimeRange[];
};

export type ParticipantDraft = {
  nickname: string;
  selectedDates: string[];
  availability: AvailabilityItem[];
};

const getStorageKey = (meetingId: string) => `whenwe:participant:${meetingId}`;

export function getParticipantDraft(
  meetingId: string,
): ParticipantDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = sessionStorage.getItem(getStorageKey(meetingId));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ParticipantDraft;
  } catch {
    return null;
  }
}

export function saveParticipantDraft(
  meetingId: string,
  draft: ParticipantDraft,
) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(getStorageKey(meetingId), JSON.stringify(draft));
}
