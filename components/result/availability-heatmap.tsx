type HeatmapRow = {
  date: string;
  counts: number[];
};

type AvailabilityHeatmapProps = {
  rows: HeatmapRow[];
  totalParticipants: number;
};

export function AvailabilityHeatmap({
  rows,
  totalParticipants,
}: AvailabilityHeatmapProps) {
  const getHeatLevel = (count: number) => {
    if (count === 0) {
      return "h0";
    }

    const ratio = count / totalParticipants;

    if (ratio <= 0.25) {
      return "h1";
    }

    if (ratio <= 0.5) {
      return "h2";
    }

    if (ratio < 1) {
      return "h3";
    }

    return "h4";
  };

  return (
    <div className="heatmap">
      <div className="heat-labels">
        <span>오전 9시</span>
        <span>오후 1시</span>
        <span>오후 5시</span>
      </div>

      {rows.map((row) => (
        <div className="heat-row" key={row.date}>
          <span>{row.date}</span>

          <div>
            {row.counts.map((count, index) => (
              <button
                type="button"
                key={`${row.date}-${index}`}
                className={`heat-cell ${getHeatLevel(count)}`}
                title={`${count}/${totalParticipants}명 가능`}
                aria-label={`${row.date} ${index + 9}시, ${totalParticipants}명 중 ${count}명 가능`}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="legend">
        <span>
          <i className="h1" />
          적음
        </span>

        <span>
          <i className="h3" />
          많음
        </span>

        <span>
          <i className="h4" />
          모두 가능
        </span>
      </div>
    </div>
  );
}
