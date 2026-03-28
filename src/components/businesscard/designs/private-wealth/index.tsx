import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function PrivateWealth({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const displayFields = fields.filter(k => !["name", "title", "company"].includes(k));

  return (
    <div className={`${baseClass} card--private-wealth !p-0`}>
      <div className="card card-8 w-full h-full">
        <div className="card-8-content">
          <div className="card-8-crest" />
          <div className="card-8-header w-full">
            <FitText align="left" className="card-8-brand block max-w-full px-4">{data.company || "Private Wealth Partners"}</FitText>
          </div>
          <div className="card-8-main w-full">
            <FitText align="left" className="card-8-name max-w-full px-2">{name}</FitText>
            <FitText align="left" className="card-8-title max-w-full px-4">{title}</FitText>
            <div className="card-8-divider" />
            <div className="card-8-info">
              {displayFields.slice(0, 2).map((k) => (
                <FitText key={k} align="left" className="card-8-info-item w-full">
                  <p className="card-8-info-label truncate">{k}</p>
                  <p className="card-8-info-value truncate">{data[k]}</p>
                </FitText>
              ))}
            </div>
          </div>
          <div className="card-8-footer">
            <div className="card-8-contact w-full">
              {displayFields.slice(2, 4).map(k => (
                <FitText key={k} align="center" className="mx-auto max-w-[150px]">{data[k]}</FitText>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
