import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function LuxuryHotel({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--luxury-hotel !p-0`}>
      <div className="card arch-arch-card-4 w-full h-full">
        <div className="arch-card-4-content">
          <div className="arch-card-4-fleur" />
          <div className="arch-card-4-header w-full overflow-hidden">
            <FitText align="center" className="arch-card-4-brand w-full px-4 overflow-hidden" style={{ fontFamily: "'Cinzel', serif" }}>
              {data.company || "The Grand Palace"}
            </FitText>
          </div>
          <div className="arch-card-4-main w-full overflow-hidden">
            <FitText align="center" className="arch-card-4-name w-full px-4 overflow-hidden" style={{ fontFamily: "'Playfair Display', serif" }}>{name}</FitText>
            <FitText align="center" className="arch-card-4-title w-full px-4 overflow-hidden" style={{ fontFamily: "'Cinzel', serif" }}>{title}</FitText>
            <div className="arch-card-4-divider">
              <div className="arch-card-4-divider-icon" />
            </div>
            <div className="arch-card-4-contact w-full overflow-hidden" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="center" className="w-full px-4 overflow-hidden">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="arch-card-4-footer w-full overflow-hidden">
            <p className="arch-card-4-tagline" style={{ fontFamily: "'Playfair Display', serif", fontStyle: "italic", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"Excellence in every detail"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
