import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function CreativeDirector({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const nameParts = name.split(" ");
  const formattedName = nameParts.length > 1
    ? `${nameParts[0]}\n${nameParts.slice(1).join(" ")}`
    : name;

  return (
    <div className={`${baseClass} card--creative-director !p-0`}>
      <div className="card arch-arch-card-9 w-full h-full">
        <div className="arch-card-9-content">
          <div className="arch-card-9-shapes" />
          <div className="arch-card-9-header w-[calc(100%-80px)] overflow-hidden">
            <FitText align="left" className="arch-card-9-brand w-full overflow-hidden" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
              {data.company || "Konstruct Studio"}
            </FitText>
          </div>
          <div className="arch-card-9-main w-[calc(100%-64px)] overflow-hidden">
            <FitText align="left" className="arch-card-9-name w-full overflow-hidden" style={{ fontFamily: "'Bebas Neue', sans-serif", whiteSpace: "pre-line" }}>
              {formattedName.toUpperCase()}
            </FitText>
            <FitText align="left" className="arch-card-9-title w-full overflow-hidden" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{title}</FitText>
          </div>
          <div className="arch-card-9-footer w-[calc(100%-64px)] left-8 flex items-end justify-between overflow-hidden">
            <div className="arch-card-9-contact max-w-[120px] overflow-hidden">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 2).map(k => (
                <FitText key={k} align="left" className="w-full overflow-hidden">{data[k]}</FitText>
              ))}
            </div>
            <div className="arch-card-9-badge flex-shrink-0 ml-2" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>AVAILABLE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
