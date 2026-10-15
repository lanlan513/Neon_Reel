interface Props {
  value: number;
}

/** Editorial score rendered as a neon gauge: numeral + 10 segment ticks. */
export function Rating({ value }: Props) {
  const filled = Math.round(value);

  return (
    <div className="rating" aria-label={`評分 ${value.toFixed(1)} 分，滿分 10 分`}>
      <span className="rating__num">{value.toFixed(1)}</span>
      <span className="rating__den">／10</span>
      <span className="rating__ticks" aria-hidden="true">
        {Array.from({ length: 10 }, (_, index) => (
          <span key={index} className={index < filled ? 'is-on' : undefined} />
        ))}
      </span>
    </div>
  );
}
