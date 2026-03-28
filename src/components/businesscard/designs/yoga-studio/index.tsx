import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function YogaStudio({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--yoga-studio !p-0`}>
      <div className="card arch-arch-card-12 w-full h-full">
        <div className="arch-card-12-content">
          <div className="arch-card-12-lotus" />
          <div className="arch-card-12-header w-full">
            <FitText align="left" className="arch-card-12-brand block max-w-full px-4">{data.company || "Lotus Yoga"}</FitText>
          </div>
          <div className="arch-card-12-main w-full">
            <FitText align="left" className="arch-card-12-name max-w-full px-2">{name}</FitText>
            <FitText align="left" className="arch-card-12-title max-w-full px-4">{title}</FitText>
            <div className="arch-card-12-divider" />
            <div className="arch-card-12-contact w-full">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="center" className="max-w-[200px] mx-auto text-center">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="arch-card-12-footer w-full">
            <p className="arch-card-12-quote">"Find your inner peace"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
