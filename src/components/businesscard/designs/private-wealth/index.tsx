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
          <div className="card-8-header w-full overflow-hidden">
            <FitText align="center" className="card-8-brand w-full px-4 overflow-hidden" style={{ fontFamily: "'Cinzel', serif" }}>
              {data.company || "Private Wealth Partners"}
            </FitText>
          </div>
          <div className="card-8-main w-full overflow-hidden">
            <FitText align="center" className="card-8-name w-full px-2 overflow-hidden" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{name}</FitText>
            <FitText align="center" className="card-8-title w-full px-4 overflow-hidden" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>{title}</FitText>
            <div className="card-8-divider" />
            <div className="card-8-info overflow-hidden">
              {displayFields.slice(0, 2).map((k) => (
                <div key={k} className="card-8-info-item overflow-hidden">
                  <p className="card-8-info-label" style={{ fontFamily: "'Libre Franklin', sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{k}</p>
                  <p className="card-8-info-value" style={{ fontFamily: "'Cormorant Garamond', serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data[k]}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="card-8-footer overflow-hidden">
            <div className="card-8-contact w-full overflow-hidden" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>
              {displayFields.slice(2, 4).map(k => (
                <FitText key={k} align="center" className="w-full px-4 overflow-hidden">{data[k]}</FitText>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
