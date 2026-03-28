import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function TechPioneer({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  return (
    <div className={`${baseClass} card--tech-pioneer !p-0`}>
      <div className="card arch-arch-card-3 w-full h-full">
        <div className="arch-card-3-content">
          <div className="arch-card-3-circuit" />
          <div className="arch-card-3-header">
            <FitText align="left" className="arch-card-3-brand max-w-[120px]">{data.company || "TechVentures"}</FitText>
            <FitText align="left" className="arch-card-3-status max-w-[80px]">{data.status || "ONLINE"}</FitText>
          </div>
          <div className="arch-card-3-main">
            <FitText align="left" className="arch-card-3-label max-w-[200px]">// {title}</FitText>
            <FitText align="left" className="arch-card-3-name max-w-full">{firstName}</FitText>
            {lastName && <FitText align="left" className="arch-card-3-surname max-w-full">{lastName}</FitText>}
            <FitText align="left" className="arch-card-3-title max-w-[200px]">Building the future</FitText>
          </div>
          <div className="arch-card-3-footer w-[calc(100%-64px)]">
            <div className="arch-card-3-contact w-full">
              {fields.filter(k => !["name", "title", "company", "status"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="left" className="max-w-full">{data[k]}</FitText>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
