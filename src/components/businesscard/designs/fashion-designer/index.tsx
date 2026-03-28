import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function FashionDesigner({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  return (
    <div className={`${baseClass} card--fashion-designer !p-0`}>
      <div className="card arch-arch-card-7 w-full h-full">
        <div className="arch-card-7-content">
          <div className="arch-card-7-icon" />
          <div className="arch-card-7-header w-[calc(100%-80px)]">
            <FitText align="left" className="arch-card-7-brand block max-w-full">{data.company || "Maison Noir"}</FitText>
          </div>
          <div className="arch-card-7-main w-full">
            <FitText align="left" className="arch-card-7-name max-w-[220px]">{firstName}</FitText>
            <FitText align="left" className="arch-card-7-surname max-w-[220px]">{lastName}</FitText>
            <FitText align="left" className="arch-card-7-title max-w-[220px]">{title}</FitText>
          </div>
          <div className="arch-card-7-footer w-[calc(100%-64px)]">
            <div className="arch-card-7-contact w-full">
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
