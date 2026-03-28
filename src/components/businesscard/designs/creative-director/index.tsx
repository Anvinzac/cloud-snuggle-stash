import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function CreativeDirector({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const nameParts = name.split(" ");
  const formattedName = nameParts.length > 1 ? `${nameParts[0]}\n${nameParts.slice(1).join(" ")}` : name;

  return (
    <div className={`${baseClass} card--creative-director !p-0`}>
      <div className="card arch-arch-card-9 w-full h-full">
        <div className="arch-card-9-content">
          <div className="arch-card-9-shapes" />
          <div className="arch-card-9-header w-[calc(100%-80px)]">
            <FitText align="left" className="arch-card-9-brand block max-w-full">{data.company || "Konstruct Studio"}</FitText>
          </div>
          <div className="arch-card-9-main w-[calc(100%-64px)]">
            <h1 className="arch-card-9-name min-w-[150px] max-w-full" style={{ whiteSpace: "pre-line" }}>{formattedName.toUpperCase()}</h1>
            <FitText align="left" className="arch-card-9-title max-w-[200px]">{title}</FitText>
          </div>
          <div className="arch-card-9-footer w-[calc(100%-64px)] left-8 flex items-end justify-between">
            <div className="arch-card-9-contact max-w-[120px]">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 2).map(k => (
                <FitText key={k} align="left" className="w-full">{data[k]}</FitText>
              ))}
            </div>
            <div className="arch-card-9-badge flex-shrink-0 ml-2">AVAILABLE</div>
          </div>
        </div>
      </div>
    </div>
  );
}
