import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function ArtisanBaker({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--artisan-baker !p-0`}>
      <div className="card arch-arch-card-5 w-full h-full">
        <div className="arch-card-5-content">
          <div className="arch-card-5-bread" />
          <div className="arch-card-5-header w-full overflow-hidden">
            <FitText align="center" className="arch-card-5-brand w-full px-4 overflow-hidden" style={{ fontFamily: "'Permanent Marker', cursive" }}>
              {data.company || "Artisan Bakery"}
            </FitText>
          </div>
          <div className="arch-card-5-main w-full overflow-hidden">
            <FitText align="center" className="arch-card-5-name w-full px-4 overflow-hidden" style={{ fontFamily: "'Permanent Marker', cursive" }}>{name}</FitText>
            <FitText align="center" className="arch-card-5-title w-full px-4 overflow-hidden" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>{title}</FitText>
            <div className="arch-card-5-divider" />
            <div className="arch-card-5-contact w-full overflow-hidden" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="center" className="w-full px-4 overflow-hidden">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="arch-card-5-footer w-full overflow-hidden">
            <p className="arch-card-5-tagline" style={{ fontFamily: "'Permanent Marker', cursive", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"Baked with love"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
