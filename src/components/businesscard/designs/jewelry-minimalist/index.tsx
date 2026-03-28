import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function JewelryMinimalist({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const displayFields = fields.filter(k => !["name", "title"].includes(k));

  return (
    <div className={`${baseClass} card--jewelry-minimalist !p-0`}>
      <div className="card card-3 w-full h-full">
        <div className="card-3-content">
          <div className="card-3-monogram" />
          <FitText align="left" className="card-3-name max-w-full px-4 w-full">{name}</FitText>
          <FitText align="center" className="card-3-title max-w-full px-4 text-center">{title}</FitText>
          <div className="card-3-ornament" />
          <div className="card-3-contact w-full">
            {displayFields.slice(0, 3).map(k => (
              <FitText key={k} align="center" className="mx-auto max-w-[200px]">{data[k]}</FitText>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
