import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function WellnessCoach({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--wellness-coach !p-0`}>
      <div className="card arch-arch-card-6 w-full h-full">
        <div className="arch-card-6-content">
          <div className="arch-card-6-lotus" />
          <div className="arch-card-6-header w-full">
            <FitText align="left" className="arch-card-6-brand block max-w-full px-4">{data.company || "Serenity Wellness"}</FitText>
          </div>
          <div className="arch-card-6-main w-full">
            <FitText align="left" className="arch-card-6-name max-w-full px-2">{name}</FitText>
            <FitText align="left" className="arch-card-6-title max-w-full px-4">{title}</FitText>
            <div className="arch-card-6-divider" />
            <div className="arch-card-6-contact w-full">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="center" className="max-w-[200px] mx-auto text-center">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="arch-card-6-footer w-full">
            <p className="arch-card-6-quote">"Balance in every breath"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
