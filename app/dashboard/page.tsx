"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Check, Link2, Plus } from "lucide-react";

import { Button } from "../../components/common/ww-button";
import { PageShell } from "../../components/common/page-shell";

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="whenwe-app">
      <PageShell onHome={() => router.push("/")}>
        <div className="dashboard-head">
          <div>
            <p className="flow-kicker">MY WHENWE</p>
            <h2>안녕하세요, 민지님</h2>
          </div>

          <Button onClick={() => router.push("/meetings/new")}>
            <Plus />새 모임
          </Button>
        </div>

        <div className="section-title">
          <h3>내 모임</h3>

          <button className="text-button">
            전체 보기
            <ArrowRight />
          </button>
        </div>

        <div className="event-list">
          <button
            className="event-card"
            onClick={() => router.push("/prototype")}
          >
            <span className="status open">진행 중</span>

            <h3>금요일 저녁 모임</h3>

            <p>
              <CalendarDays />
              참여자 5명
            </p>

            <div className="event-footer">
              <span>조율 마감까지 2일</span>
              <ArrowRight />
            </div>
          </button>

          <button
            className="event-card"
            onClick={() => router.push("/prototype")}
          >
            <span className="status confirmed">확정됨</span>

            <h3>프로젝트 킥오프</h3>

            <p>
              <CalendarDays />
              참여자 8명
            </p>

            <div className="event-footer">
              <span>6월 12일 (목) 오후 2:00</span>
              <Check />
            </div>
          </button>
        </div>

        <div className="dashboard-empty">
          <div>
            <Link2 />
            <span>공유 링크로 모임에 참여하세요</span>
          </div>

          <Button variant="outline" onClick={() => router.push("/prototype")}>
            참여하기
          </Button>
        </div>
      </PageShell>
    </div>
  );
}
