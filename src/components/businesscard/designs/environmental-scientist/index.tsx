import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function EnvironmentalScientist({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  return (
    <div className={`${baseClass} card--environmental-scientist !p-0`}>
      <div className="card arch-arch-card-10 w-full h-full">
        <div className="arch-card-10-content">
          <div className="arch-card-10-dna" />
          <div className="arch-card-10-header w-[calc(100%-80px)]">
            <FitText align="left" className="arch-card-10-brand block max-w-full">{data.company || "EcoResearch Institute"}</FitText>
          </div>
          <div className="arch-card-10-main w-[calc(100%-64px)]">
            <FitText align="left" className="arch-card-10-title max-w-full">{title}</FitText>
            <FitText align="left" className="arch-card-10-name max-w-[200px]">{firstName}</FitText>
            <FitText align="left" className="arch-card-10-surname max-w-[200px]">{lastName}</FitText>
            <div className="arch-card-10-chart">
              <span /><span /><span /><span /><span />
            </div>
          </div>
          <div className="arch-card-10-footer w-[calc(100%-64px)]">
            <div className="arch-card-10-contact w-full">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 2).map(k => (
                <FitText key={k} align="left" className="max-w-[200px]">{data[k]}</FitText>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
