import type { ReactNode } from "react";

import { Header } from "./header";
import { Stepper } from "./stepper";

type PageShellProps = {
  children: ReactNode;
  onHome: () => void;
  step?: number;
  onMenu?: () => void;
};

export function PageShell({ children, onHome, step, onMenu }: PageShellProps) {
  return (
    <>
      <Header onHome={onHome} onMenu={onMenu} />

      {step !== undefined && <Stepper current={step} />}

      <main className="page-shell">{children}</main>
    </>
  );
}
