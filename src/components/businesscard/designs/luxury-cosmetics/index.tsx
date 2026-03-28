import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function LuxuryCosmetics({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const initials = name.charAt(0).toUpperCase() || "S";

  return (
    <div className={`${baseClass} card--luxury-cosmetics !p-0`}>
      <div className="card card-7 w-full h-full">
        <div className="card-7-content">
          <div className="card-7-circles" />
          <div className="card-7-header">
            <div className="card-7-monogram font-['Cormorant_Garamond'] text-[28px] italic text-[var(--lc-rose-gold)] flex items-center justify-center">{initials}</div>
            <FitText align="left" className="card-7-brand w-full px-4">{data.company || "Lumière Cosmetics"}</FitText>
          </div>
          <div className="card-7-main">
            <FitText align="right" className="card-7-name max-w-[200px] float-right">{name}</FitText>
            <div className="clear-both" />
            <FitText align="right" className="card-7-title max-w-[200px] float-right">{title}</FitText>
            <div className="clear-both" />
            <div className="card-7-divider" />
            <div className="card-7-contact flex flex-col items-end">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="right" className="max-w-[180px] text-right">{data[k]}</FitText>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
