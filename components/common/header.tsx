import { Menu } from "lucide-react";
import { Logo } from "./logo";

type HeaderProps = {
  onHome: () => void;
  onMenu?: () => void;
};

export function Header({ onHome, onMenu }: HeaderProps) {
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
