import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function TravelAgent({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--travel-agent !p-0`}>
      <div className="card arch-arch-card-14 w-full h-full">
        <div className="arch-card-14-content">
          <div className="arch-card-14-globe" />
          <div className="arch-card-14-header w-full">
            <FitText align="left" className="arch-card-14-brand block max-w-full px-4">{data.company || "World Travelers"}</FitText>
          </div>
          <div className="arch-card-14-main w-full">
            <FitText align="center" className="arch-card-14-name max-w-[200px] mx-auto text-center">{name}</FitText>
            <FitText align="center" className="arch-card-14-title max-w-[200px] mx-auto text-center">{title}</FitText>
            <div className="arch-card-14-divider" />
            <div className="arch-card-14-contact w-full">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="center" className="max-w-[200px] mx-auto text-center">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="arch-card-14-footer w-full">
            <FitText align="left" className="arch-card-14-tagline max-w-full px-4">"Explore the world"</FitText>
          </div>
        </div>
      </div>
    </div>
  );
}
