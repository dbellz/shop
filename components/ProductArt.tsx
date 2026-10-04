import type { Category } from "@/lib/types";

export function ProductArt({ category, color, className = "" }: { category: Category | string; color: string; className?: string }) {
  const shade = "rgba(0,0,0,.14)";
  return (
    <svg viewBox="0 0 200 200" className={className} role="img" aria-label={category}>
      <rect width="200" height="200" fill="#f4f4f5" />
      {category === "tops" && (
        <g>
          <path d="M65 35 L40 50 L15 85 L40 100 L55 85 L55 175 L145 175 L145 85 L160 100 L185 85 L160 50 L135 35 Q100 60 65 35Z" fill={color} />
          <path d="M65 35 Q100 60 135 35 Q100 75 65 35Z" fill={shade} />
        </g>
      )}
      {category === "sweatshirts" && (
        <g>
          <path d="M65 30 L35 45 L10 140 L40 148 L55 95 L55 175 L145 175 L145 95 L160 148 L190 140 L165 45 L135 30 Q100 55 65 30Z" fill={color} />
          <path d="M65 30 Q100 58 135 30 Q100 78 65 30Z" fill={shade} />
          <rect x="55" y="165" width="90" height="10" fill={shade} />
          <rect x="10" y="136" width="30" height="12" transform="rotate(-9 25 142)" fill={shade} />
          <rect x="160" y="136" width="30" height="12" transform="rotate(9 175 142)" fill={shade} />
        </g>
      )}
      {category === "caps" && (
        <g>
          <path d="M45 120 Q45 55 100 55 Q155 55 155 120Z" fill={color} />
          <path d="M100 55 L100 120" stroke={shade} strokeWidth="2" />
          <path d="M30 120 L170 120 Q190 125 185 135 L40 135 Q25 130 30 120Z" fill={shade} />
          <circle cx="100" cy="52" r="5" fill={shade} />
        </g>
      )}
    </svg>
  );
}
