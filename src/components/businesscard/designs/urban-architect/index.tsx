import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function UrbanArchitect({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  return (
    <div className={`${baseClass} card--urban-architect !p-0`}>
      <div className="card arch-arch-card-1 w-full h-full">
        <div className="arch-card-1-content">
          <div className="arch-card-1-grid">
            <span /><span /><span />
            <span /><span /><span />
            <span /><span /><span />
            <span />
          </div>
          <div className="arch-card-1-header">
            <FitText align="left" className="arch-card-1-brand block max-w-[200px]">{data.company || "Urban Studio"}</FitText>
          </div>
          <div className="arch-card-1-main">
            <FitText align="left" className="arch-card-1-title max-w-[200px]">{title}</FitText>
            <FitText align="left" className="arch-card-1-name max-w-full">{firstName}</FitText>
            <FitText align="left" className="arch-card-1-surname max-w-full">{lastName}</FitText>
          </div>
          <div className="arch-card-1-footer">
            <div className="arch-card-1-contact">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="left" className="max-w-[150px]">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="arch-card-1-accent" />
        </div>
      </div>
    </div>
  );
}
