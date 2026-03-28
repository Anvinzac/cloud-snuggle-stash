import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function KineticTypographer({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  return (
    <div className={`${baseClass} card--kinetic-typographer !p-0`}>
      <div className="card card-15 w-full h-full">
        <div className="card-15-content">
          <div className="card-15-header w-full">
            <FitText align="left" className="card-15-brand max-w-[150px]">{data.company || "Atelier"}</FitText>
            <span className="card-15-year">MMXXIV</span>
          </div>
          <div className="card-15-main w-[calc(100%-48px)]">
            <FitText align="left" className="card-15-name max-w-full">{firstName}</FitText>
            <FitText align="left" className="card-15-surname max-w-full">{lastName}</FitText>
            <FitText align="left" className="card-15-title max-w-full">{title}</FitText>
            <div className="card-15-divider" />
            <div className="card-15-contact w-full">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="left" className="w-full">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="card-15-footer w-[calc(100%-48px)]">
            <FitText align="left" className="card-15-badge max-w-[80px]">PORTFOLIO</FitText>
            <FitText align="left" className="card-15-id max-w-[80px]">{data.id?.substring(0, 7) || "A.H.024"}</FitText>
          </div>
        </div>
      </div>
    </div>
  );
}
