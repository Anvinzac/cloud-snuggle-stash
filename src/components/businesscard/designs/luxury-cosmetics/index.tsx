import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function LuxuryCosmetics({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const initial = name.charAt(0).toUpperCase();

  return (
    <div className={`${baseClass} card--luxury-cosmetics !p-0`}>
      <div className="card card-7 w-full h-full">
        <div className="card-7-content">
          <div className="card-7-circles" />
          <div className="card-7-header overflow-hidden">
            <div className="card-7-monogram" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontStyle: "italic", color: "var(--lc-rose-gold)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {initial}
            </div>
            <FitText align="center" className="card-7-brand w-full px-4 overflow-hidden" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {data.company || "Lumière Cosmetics"}
            </FitText>
          </div>
          <div className="card-7-main overflow-hidden">
            <FitText align="right" className="card-7-name w-full overflow-hidden" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{name}</FitText>
            <FitText align="right" className="card-7-title w-full overflow-hidden" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>{title}</FitText>
            <div className="card-7-divider" />
            <div className="card-7-contact flex flex-col items-end overflow-hidden">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="right" className="w-full overflow-hidden" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>{data[k]}</FitText>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
