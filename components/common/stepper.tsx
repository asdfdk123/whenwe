type StepperProps = {
  current: number;
};

export function Stepper({ current }: StepperProps) {
  return (
    <div className="stepper" aria-label={`전체 3단계 중 ${current}단계`}>
      <span className={current >= 1 ? "active" : ""}>1</span>

      <i />

      <span className={current >= 2 ? "active" : ""}>2</span>

      <i />

      <span className={current >= 3 ? "active" : ""}>3</span>
    </div>
  );
}
