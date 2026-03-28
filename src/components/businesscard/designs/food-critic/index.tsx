import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function FoodCritic({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  return (
    <div className={`${baseClass} card--food-critic !p-0`}>
      <div className="card arch-arch-card-15 w-full h-full">
        <div className="arch-card-15-content">
          <div className="arch-card-15-fork" />
          <div className="arch-card-15-header w-[calc(100%-64px)] left-8">
            <FitText align="left" className="arch-card-15-brand block max-w-full">{data.company || "Culinary Review"}</FitText>
          </div>
          <div className="arch-card-15-main w-[calc(100%-32px)]">
            <FitText align="left" className="arch-card-15-title max-w-full">{title}</FitText>
            <FitText align="left" className="arch-card-15-name max-w-[200px]">{firstName}</FitText>
            <FitText align="left" className="arch-card-15-surname max-w-[200px]">{lastName}</FitText>
            <div className="arch-card-15-stars">
              <span /><span /><span />
            </div>
          </div>
          <div className="arch-card-15-footer w-[calc(100%-64px)] flex items-end justify-between">
            <div className="arch-card-15-contact max-w-[120px]">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 2).map(k => (
                <FitText key={k} align="left" className="w-full">{data[k]}</FitText>
              ))}
            </div>
            <div className="arch-card-15-badge whitespace-nowrap hidden sm:inline-block">EXPERT TASTE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
