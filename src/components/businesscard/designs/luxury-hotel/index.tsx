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
          <div className="arch-card-4-header w-full">
            <FitText align="left" className="arch-card-4-brand w-full px-4">{data.company || "The Grand Palace"}</FitText>
          </div>
          <div className="arch-card-4-main w-full">
            <FitText align="center" className="arch-card-4-name max-w-[200px] mx-auto text-center">{name}</FitText>
            <FitText align="center" className="arch-card-4-title max-w-[200px] mx-auto text-center">{title}</FitText>
            <div className="arch-card-4-divider">
              <div className="arch-card-4-divider-icon" />
            </div>
            <div className="arch-card-4-contact w-full">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="center" className="max-w-[200px] mx-auto text-center">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="arch-card-4-footer w-full">
            <FitText align="left" className="arch-card-4-tagline w-full">"Excellence in every detail"</FitText>
          </div>
        </div>
      </div>
    </div>
  );
}
