"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Download,
  Edit3,
  Info,
  Link2,
  LockKeyhole,
  Menu,
  MoreHorizontal,
  Plus,
  Send,
  Share2,
  Sparkles,
  Users,
  X,
} from "lucide-react";

type View =
  | "home"
  | "join"
  | "dates"
  | "times"
  | "review"
  | "submitted"
  | "dashboard"
  | "create"
  | "share"
  | "results"
  | "confirmed";
const dates = [
  "6월 18일 (수)",
  "6월 19일 (목)",
  "6월 20일 (금)",
  "6월 23일 (월)",
  "6월 24일 (화)",
];
const slots = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
];

function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
  type = "button",
}: any) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`ww-button ww-${variant} ${className}`}
    >
      {children}
    </button>
  );
}
function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <button onClick={onClick} className="logo" aria-label="WhenWe 홈">
      <span className="logo-mark">
        <span />
        <span />
        <span />
      </span>
      <span>whenwe</span>
    </button>
  );
}
function Header({
  onHome,
  onMenu,
}: {
  onHome: () => void;
  onMenu?: () => void;
}) {
  return (
    <header className="topbar">
      <Logo onClick={onHome} />
      <div className="top-actions">
        <button className="icon-button" onClick={onMenu} aria-label="메뉴">
          <Menu />
        </button>
      </div>
    </header>
  );
}
function Step({ current }: { current: number }) {
  return (
    <div
      className="stepper"
      aria-label={`전체 ${current}단계 중 ${current}단계`}
    >
      <span className={current >= 1 ? "active" : ""}>1</span>
      <i />
      <span className={current >= 2 ? "active" : ""}>2</span>
      <i />
      <span className={current >= 3 ? "active" : ""}>3</span>
    </div>
  );
}
function PageShell({ children, onHome, step, onMenu }: any) {
  return (
    <>
      <Header onHome={onHome} onMenu={onMenu} />
      {step && <Step current={step} />}
      <main className="page-shell">{children}</main>
    </>
  );
}
function Calendar({
  selected,
  setSelected,
}: {
  selected: string[];
  setSelected: (x: string[]) => void;
}) {
  const cells = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
  ];
  return (
    <div className="calendar">
      <div className="calendar-head">
        <button className="icon-button">
          <ArrowLeft />
        </button>
        <strong>2025년 6월</strong>
        <button className="icon-button">
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
        {cells.map((d, i) => {
          const key = `${d}`;
          const picked = selected.includes(key);
          const unavailable = i < 17 || i > 23;
          return (
            <button
              key={d}
              disabled={unavailable}
              onClick={() =>
                setSelected(
                  picked
                    ? selected.filter((x) => x !== key)
                    : [...selected, key],
                )
              }
              className={`${picked ? "picked" : ""} ${unavailable ? "muted" : ""}`}
            >
              {d}
              {d === "18" && <small>오늘</small>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
function Home({ go }: { go: (v: View) => void }) {
  return (
    <PageShell onHome={() => go("home")} onMenu={() => go("dashboard")}>
      <section className="hero">
        <div className="eyebrow">
          <Sparkles /> 일정 조율이 쉬워지는 순간
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
          <Button onClick={() => go("create")}>
            새 일정 만들기 <ArrowRight />
          </Button>
          <Button variant="ghost" onClick={() => go("join")}>
            참여 코드로 들어가기
          </Button>
        </div>
      </section>
      <section className="home-preview">
        <div className="preview-label">
          THIS WEEK <span>가장 많이 겹치는 시간</span>
        </div>
        <div className="preview-card">
          <div className="mini-days">
            <b>
              수<br />
              <strong>18</strong>
            </b>
            <b>
              목<br />
              <strong>19</strong>
            </b>
            <b className="today">
              금<br />
              <strong>20</strong>
            </b>
            <b>
              토<br />
              <strong>21</strong>
            </b>
          </div>
          <div className="preview-bar">
            <span style={{ width: "72%" }}>
              <Users /> 5명 모두 가능
            </span>
          </div>
          <div className="preview-caption">
            <Check /> 6월 20일 금요일, 오후 2시가 가장 좋아요
          </div>
        </div>
      </section>
    </PageShell>
  );
}
function Join({ go }: { go: (v: View) => void }) {
  const [name, setName] = useState("");
  return (
    <PageShell step={1} onHome={() => go("home")}>
      <div className="flow-card">
        <div className="flow-kicker">MEETING #A7K9L2</div>
        <h2>금요일 저녁 모임</h2>
        <p className="muted-text">친구들과의 다음 만남 시간을 정해봐요.</p>
        <label className="field-label" htmlFor="name">
          이름을 입력해주세요
        </label>
        <input
          id="name"
          className="ww-input"
          placeholder="예: 김민지"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Button className="full" onClick={() => go("dates")}>
          <ArrowRight /> 다음
        </Button>
        <p className="privacy">
          <LockKeyhole /> 입력한 이름은 일정 참여자에게만 보여요.
        </p>
      </div>
    </PageShell>
  );
}
function Dates({ go }: { go: (v: View) => void }) {
  const [selected, setSelected] = useState(["18", "19"]);
  return (
    <PageShell step={2} onHome={() => go("home")}>
      <div className="flow-card wide">
        <div className="flow-kicker">STEP 1 OF 2</div>
        <h2>
          가능한 날짜를
          <br />
          모두 선택해주세요.
        </h2>
        <p className="muted-text">여러 날짜를 선택할 수 있어요.</p>
        <Calendar selected={selected} setSelected={setSelected} />
        <div className="selection-summary">
          <span>선택한 날짜</span>
          <div>
            {selected.map((x) => (
              <b key={x}>
                6월 {x}일 <X />
              </b>
            ))}
          </div>
        </div>
        <Button
          className="full"
          onClick={() => go("times")}
          disabled={!selected.length}
        >
          다음: 시간 선택 <ArrowRight />
        </Button>
      </div>
    </PageShell>
  );
}
function Times({ go }: { go: (v: View) => void }) {
  const [day, setDay] = useState(0);
  const [ranges, setRanges] = useState<Record<number, string[]>>({
    0: ["14:00 – 17:00"],
    1: [],
  });
  return (
    <PageShell step={2} onHome={() => go("home")}>
      <div className="flow-card wide">
        <div className="flow-kicker">STEP 2 OF 2</div>
        <h2>
          가능한 시간대를
          <br />
          알려주세요.
        </h2>
        <p className="muted-text">
          선택한 날짜별로 가능한 시간을 추가해주세요.
        </p>
        <div className="date-tabs">
          {dates.slice(0, 2).map((d, i) => (
            <button
              className={day === i ? "active" : ""}
              onClick={() => setDay(i)}
              key={d}
            >
              {d}
              <small>
                {ranges[i]?.length
                  ? `${ranges[i].length}개 시간대`
                  : "아직 없음"}
              </small>
            </button>
          ))}
        </div>
        <div className="time-picker">
          <div className="time-row">
            <Clock3 />
            <span>시작</span>
            <button>
              14:00 <ChevronDown />
            </button>
            <span>부터</span>
            <button>
              17:00 <ChevronDown />
            </button>
          </div>
          <Button
            variant="soft"
            onClick={() => setRanges({ ...ranges, [day]: ["14:00 – 17:00"] })}
          >
            <Plus /> 시간대 추가
          </Button>
        </div>
        <div className="range-list">
          {(ranges[day] || []).map((r) => (
            <div key={r}>
              <span>{r}</span>
              <button aria-label="시간대 삭제">
                <X />
              </button>
            </div>
          ))}
        </div>
        <Button className="full" onClick={() => go("review")}>
          내 일정 확인하기 <ArrowRight />
        </Button>
      </div>
    </PageShell>
  );
}
function Review({ go }: { go: (v: View) => void }) {
  return (
    <PageShell step={3} onHome={() => go("home")}>
      <div className="flow-card">
        <div className="flow-kicker">마지막 확인</div>
        <h2>이렇게 제출할까요?</h2>
        <p className="muted-text">제출 후에도 언제든 수정할 수 있어요.</p>
        <div className="review-box">
          <div>
            <span>이름</span>
            <b>김민지</b>
          </div>
          <div>
            <span>가능한 날짜</span>
            <b>6월 18일 (수), 6월 19일 (목)</b>
          </div>
          <div>
            <span>가능한 시간</span>
            <b>14:00 – 17:00</b>
          </div>
        </div>
        <Button className="full" onClick={() => go("submitted")}>
          제출하기 <Send />
        </Button>
        <Button variant="ghost" className="full" onClick={() => go("times")}>
          수정하기
        </Button>
      </div>
    </PageShell>
  );
}
function Submitted({ go }: { go: (v: View) => void }) {
  return (
    <PageShell onHome={() => go("home")}>
      <div className="success-card">
        <div className="success-icon">
          <Check />
        </div>
        <h2>제출 완료!</h2>
        <p>
          김민지님의 가능 시간이
          <br />
          성공적으로 저장되었어요.
        </p>
        <div className="result-teaser">
          <span>현재 가장 많이 겹치는 시간</span>
          <strong>6월 18일 (수) 14:00</strong>
          <small>5명 중 4명 가능</small>
        </div>
        <Button className="full" onClick={() => go("results")}>
          현재 결과 보기 <ArrowRight />
        </Button>
        <button className="text-button" onClick={() => go("home")}>
          나중에 확인할게요
        </button>
      </div>
    </PageShell>
  );
}
function Dashboard({ go }: { go: (v: View) => void }) {
  return (
    <PageShell onHome={() => go("home")}>
      <div className="dashboard-head">
        <div>
          <p className="flow-kicker">MY WHENWE</p>
          <h2>안녕하세요, 민지님</h2>
        </div>
        <Button onClick={() => go("create")}>
          <Plus /> 새 일정
        </Button>
      </div>
      <div className="section-title">
        <h3>내 일정</h3>
        <button className="text-button">
          전체 보기 <ArrowRight />
        </button>
      </div>
      <div className="event-list">
        <button className="event-card" onClick={() => go("results")}>
          <span className="status open">진행 중</span>
          <h3>금요일 저녁 모임</h3>
          <p>
            <CalendarDays /> 6월 18일 – 20일 · 참여자 5명
          </p>
          <div className="event-footer">
            <span>응답 마감까지 2일</span>
            <ArrowRight />
          </div>
        </button>
        <button className="event-card" onClick={() => go("confirmed")}>
          <span className="status confirmed">확정됨</span>
          <h3>프로젝트 킥오프</h3>
          <p>
            <CalendarDays /> 6월 12일 · 참여자 8명
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
          <span>참여 코드로 일정에 들어가세요</span>
        </div>
        <Button variant="outline" onClick={() => go("join")}>
          코드 입력
        </Button>
      </div>
    </PageShell>
  );
}
function Create({ go }: { go: (v: View) => void }) {
  return (
    <PageShell onHome={() => go("home")}>
      <div className="flow-card create-card">
        <div className="flow-kicker">NEW MEETING</div>
        <h2>
          새 일정을
          <br />
          만들어볼까요?
        </h2>
        <p className="muted-text">필요한 정보만 간단히 입력하면 돼요.</p>
        <label className="field-label">일정 이름</label>
        <input
          className="ww-input"
          placeholder="예: 6월 팀 회식"
          defaultValue="금요일 저녁 모임"
        />
        <label className="field-label">응답 마감일</label>
        <button className="ww-input select-input">
          2025년 6월 16일 <ChevronDown />
        </button>
        <div className="notice">
          <Info />
          <span>
            <b>응답 마감일 안내</b>
            <br />
            마감일이 지나면 결과를 확인하고 일정을 확정할 수 있어요.
          </span>
        </div>
        <Button className="full" onClick={() => go("share")}>
          일정 만들기 <ArrowRight />
        </Button>
      </div>
    </PageShell>
  );
}
function Share({ go }: { go: (v: View) => void }) {
  return (
    <PageShell onHome={() => go("home")}>
      <div className="success-card share-card">
        <div className="share-mark">
          <Share2 />
        </div>
        <h2>일정이 만들어졌어요.</h2>
        <p>아래 링크를 친구들에게 공유해주세요.</p>
        <div className="share-link">
          <span>whenwe.app/j/A7K9L2</span>
          <button>
            <Copy />
          </button>
        </div>
        <Button className="full" onClick={() => go("results")}>
          결과 화면 보기 <ArrowRight />
        </Button>
        <button className="text-button" onClick={() => go("dashboard")}>
          대시보드로 돌아가기
        </button>
      </div>
    </PageShell>
  );
}
function Heatmap() {
  return (
    <div className="heatmap">
      <div className="heat-labels">
        <span>오전 9시</span>
        <span>오후 1시</span>
        <span>오후 5시</span>
      </div>
      {dates.slice(0, 4).map((d, i) => (
        <div className="heat-row" key={d}>
          <span>{d.split(" ")[1]}</span>
          <div>
            {Array.from({ length: 9 }).map((_, j) => (
              <i className={`h${(i * 2 + j) % 5}`} key={j} />
            ))}
          </div>
        </div>
      ))}
      <div className="legend">
        <span>
          <i className="h1" /> 1명
        </span>
        <span>
          <i className="h3" /> 3명
        </span>
        <span>
          <i className="h4" /> 5명 모두 가능
        </span>
      </div>
    </div>
  );
}
function Results({ go }: { go: (v: View) => void }) {
  return (
    <PageShell onHome={() => go("home")}>
      <div className="results-head">
        <div>
          <p className="flow-kicker">RESULTS · A7K9L2</p>
          <h2>금요일 저녁 모임</h2>
          <p className="muted-text">응답 4명 · 마감 6월 16일</p>
        </div>
        <Button variant="outline" onClick={() => go("share")}>
          <Share2 /> 공유
        </Button>
      </div>
      <div className="recommend">
        <div className="recommend-label">
          <Sparkles /> 가장 좋은 시간
        </div>
        <h3>6월 18일 (수) 오후 2:00</h3>
        <p>
          <Users /> 5명 중 5명 가능
        </p>
        <Button onClick={() => go("confirmed")}>
          이 시간으로 확정하기 <Check />
        </Button>
      </div>
      <section className="results-section">
        <div className="section-title">
          <h3>전체 가능 시간</h3>
          <button className="text-button">
            참여자 보기 <Users />
          </button>
        </div>
        <Heatmap />
      </section>
      <section className="alt-list">
        <h3>다른 후보 시간</h3>
        {["6월 19일 (목) 오후 2:00", "6월 20일 (금) 오후 3:00"].map((x, i) => (
          <div key={x}>
            <span>
              <b>{i + 2}</b>
              {x}
            </span>
            <strong>{4 - i}명 가능</strong>
          </div>
        ))}
      </section>
    </PageShell>
  );
}
function Confirmed({ go }: { go: (v: View) => void }) {
  return (
    <PageShell onHome={() => go("home")}>
      <div className="success-card">
        <div className="success-icon">
          <Check />
        </div>
        <p className="flow-kicker">MEETING CONFIRMED</p>
        <h2>일정이 확정되었어요.</h2>
        <div className="confirmed-time">
          <CalendarDays />
          <div>
            <strong>6월 18일 (수)</strong>
            <span>오후 2:00 – 5:00</span>
          </div>
        </div>
        <p className="muted-text">참여자 5명에게 확정 알림을 보냈어요.</p>
        <Button className="full" onClick={() => go("dashboard")}>
          대시보드로 돌아가기
        </Button>
        <button className="text-button">
          <Download /> 캘린더에 추가하기
        </button>
      </div>
    </PageShell>
  );
}
export default function Page() {
  const [view, setView] = useState<View>("home");
  const go = (v: View) => setView(v);
  return (
    <div className="whenwe-app">
      {view === "home" && <Home go={go} />}
      {view === "join" && <Join go={go} />}
      {view === "dates" && <Dates go={go} />}
      {view === "times" && <Times go={go} />}
      {view === "review" && <Review go={go} />}
      {view === "submitted" && <Submitted go={go} />}
      {view === "dashboard" && <Dashboard go={go} />}
      {view === "create" && <Create go={go} />}
      {view === "share" && <Share go={go} />}
      {view === "results" && <Results go={go} />}
      {view === "confirmed" && <Confirmed go={go} />}
    </div>
  );
}
