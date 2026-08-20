"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, ChevronDown, Info } from "lucide-react";

import { Button } from "../../../components/common/ww-button";
import { PageShell } from "../../../components/common/page-shell";

export default function CreateMeetingPage() {
  const router = useRouter();

  return (
    <div className="whenwe-app">
      <PageShell onHome={() => router.push("/")}>
        <div className="flow-card create-card">
          <div className="flow-kicker">NEW MEETING</div>

          <h2>
            새 모임을
            <br />
            만들어볼까요?
          </h2>

          <p className="muted-text">필요한 정보만 간단히 입력하면 돼요.</p>

          <label className="field-label">모임 이름</label>

          <input
            className="ww-input"
            placeholder="예: 금요일 저녁 모임"
            defaultValue="금요일 저녁 모임"
          />

          <label className="field-label">조율 마감일</label>

          <button className="ww-input select-input">
            2026년 8월 25일
            <ChevronDown />
          </button>

          <div className="notice">
            <Info />

            <span>
              <b>조율 마감일 안내</b>
              <br />
              참가자는 마감 전까지 가능한 날짜와 시간을 제출하거나 수정할 수
              있어요.
            </span>
          </div>

          <Button className="full" onClick={() => router.push("/prototype")}>
            모임 만들기
            <ArrowRight />
          </Button>
        </div>
      </PageShell>
    </div>
  );
}
