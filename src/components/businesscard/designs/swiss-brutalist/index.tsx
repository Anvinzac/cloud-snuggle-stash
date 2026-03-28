import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function SwissBrutalist({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const nameParts = name.split(" ");
  const formattedName = nameParts.length > 1 ? `${nameParts[0]}\n${nameParts.slice(1).join(" ")}` : name;

  const displayFields = fields.filter(k => !["name", "title", "company"].includes(k));
  const mainData = displayFields.slice(0, 4);
  
  return (
    <div className={`${baseClass} card--swiss-brutalist !p-0`}>
      <div className="card card-2 w-full h-full">
        <div className="card-2-content">
          <div className="card-2-header">
            <FitText align="left" className="card-2-brand max-w-[150px]">{data.company || "Axiom Studio"}</FitText>
            <span className="card-2-id">#{data.id?.substring(0, 8).toUpperCase() || "AS-2847"}</span>
          </div>
          <div className="card-2-main">
            <FitText align="left" className="card-2-label max-w-full">{title}</FitText>
            <FitText align="left" className="card-2-name max-w-full" style={{ whiteSpace: "pre-line" }}>{formattedName}</FitText>
            <div className="card-2-block">
              {mainData.map(k => (
                <FitText key={k} align="left" className="card-2-data min-w-0">
                  <p className="card-2-data-label">{k}</p>
                  <p className="card-2-data-value truncate">{data[k]}</p>
                </FitText>
              ))}
            </div>
          </div>
          <div className="card-2-footer flex items-end justify-between">
            <div className="card-2-contact w-[150px]">
              {displayFields.slice(4, 6).map(k => (
                <FitText key={k} align="left" className=" w-full">{data[k]}</FitText>
              ))}
            </div>
            <div className="card-2-barcode">
              <span /><span /><span /><span /><span />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
