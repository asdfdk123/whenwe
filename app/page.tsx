"use client";

import { useRouter } from "next/navigation";
import { ArrowRight, Check, Sparkles, Users } from "lucide-react";

import { Button } from "../components/common/ww-button";
import { PageShell } from "../components/common/page-shell";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="whenwe-app">
      <PageShell
        onHome={() => router.push("/")}
        onMenu={() => router.push("/dashboard")}
      >
        <section className="hero">
          <div className="eyebrow">
            <Sparkles />
            일정 조율이 쉬워지는 순간
          </div>

          <h1>
            모두의 시간을
            <br />
            <em>한눈에</em> 맞춰보세요.
          </h1>

          <p>
            WhenWe는 여러 사람의 가능한 시간을 모아
            <br />
            가장 좋은 약속을 찾아주는 서비스입니다.
          </p>

          <div className="hero-actions">
            <Button onClick={() => router.push("/meetings/new")}>
              새 모임 만들기
              <ArrowRight />
            </Button>

            <Button variant="ghost" onClick={() => router.push("/prototype")}>
              참여 코드로 들어가기
            </Button>
          </div>
        </section>

        <section className="home-preview">
          <div className="preview-label">
            THIS WEEK
            <span>가장 많이 겹치는 시간</span>
          </div>

          <div className="preview-card">
            <div className="mini-days">
              <b>
                수
                <br />
                <strong>18</strong>
              </b>

              <b>
                목
                <br />
                <strong>19</strong>
              </b>

              <b className="today">
                금
                <br />
                <strong>20</strong>
              </b>

              <b>
                토
                <br />
                <strong>21</strong>
              </b>
            </div>

            <div className="preview-bar">
              <span style={{ width: "72%" }}>
                <Users />
                5명 모두 가능
              </span>
            </div>

            <div className="preview-caption">
              <Check />
              6월 20일 금요일, 오후 2시가 가장 좋아요
            </div>
          </div>
        </section>
      </PageShell>
    </div>
  );
}
