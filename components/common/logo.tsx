type LogoProps = {
  onClick?: () => void;
};

export function Logo({ onClick }: LogoProps) {
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
