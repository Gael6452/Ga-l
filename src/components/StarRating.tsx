import { StarIcon } from "./icons";

interface Props {
  label: string;
  value: number; // 0–5
}

export function StarRating({ label, value }: Props) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const diff = value - i;
    const fill = diff >= 1 ? "1" : diff >= 0.5 ? "0.5" : "0";
    return <StarIcon key={i} className="star" fill={fill} />;
  });

  return (
    <div className="rating">
      <span className="rating-label">{label}</span>
      <span className="rating-stars">{stars}</span>
      <span className="rating-value">{value.toFixed(1)}</span>
    </div>
  );
}
