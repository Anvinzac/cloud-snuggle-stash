import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function BotanicalFlorist({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const initials = data.company?.charAt(0).toUpperCase() || "F";

  return (
    <div className={`${baseClass} card--botanical-florist !p-0`}>
      <div className="card card-13 w-full h-full">
        <div className="card-13-content">
          <div className="card-13-leaf" />
          <div className="card-13-header w-full">
            <FitText align="left" className="card-13-brand w-full px-4">{data.company || "Verdant Studio"}</FitText>
            <div className="card-13-monogram flex items-center justify-center font-['Cormorant_Garamond'] text-2xl italic text-[var(--bf-forest)] opacity-60">
              {initials}
            </div>
          </div>
          <div className="card-13-main w-full">
            <FitText align="left" className="card-13-name max-w-full px-2">{name}</FitText>
            <FitText align="left" className="card-13-title max-w-full px-4">{title}</FitText>
            <div className="card-13-divider" />
            <div className="card-13-contact w-full">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="center" className="max-w-[200px] mx-auto">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="card-13-footer w-full !left-0">
            <FitText align="left" className="card-13-quote w-full px-4">"Where nature meets art"</FitText>
          </div>
        </div>
      </div>
    </div>
  );
}
