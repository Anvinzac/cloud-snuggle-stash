import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function LayeredFinTech({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  
  return (
    <div className={`${baseClass} card--layered-fintech !p-0`}>
      <div className="card card-9 w-full h-full">
        <div className="card-9-content">
          <div className="card-9-header">
            <FitText align="left" className="card-9-brand max-w-[120px]">{data.company || "FinTech Labs"}</FitText>
            <FitText align="left" className="card-9-status max-w-[80px]">{data.status || "ACTIVE"}</FitText>
          </div>
          <div className="card-9-main w-[calc(100%-64px)] !left-8">
            <div className="card-9-logo" />
            <FitText align="center" className="card-9-name max-w-full text-center">{name}</FitText>
            <FitText align="center" className="card-9-title max-w-full text-center">/ {title}</FitText>
            <div className="card-9-glass">
              <div className="card-9-contact flex flex-col space-y-2">
                {fields.filter(k => !["name", "title", "company", "status"].includes(k)).slice(0, 3).map(k => (
                  <FitText key={k} align="center" className="max-w-full text-center">{data[k]}</FitText>
                ))}
              </div>
            </div>
          </div>
          <div className="card-9-footer">
            <span className="card-9-badge">v2.4.1</span>
            <span className="card-9-badge">SECURE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
