import type { CSSProperties } from "react";
import { BusinessCardTemplateProps } from "../types";
import { FitText } from "../FitText";

export default function NaturePreserve({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--nature-preserve !p-0`}>
      <div className="card arch-arch-card-2 w-full h-full">
        <div className="arch-card-2-content">
          <div className="arch-card-2-leaf" />
          <div className="arch-card-2-header w-full px-4 overflow-hidden">
            <FitText align="center" className="arch-card-2-brand w-full">{data.company || "Nature Preserve"}</FitText>
          </div>
          <div className="arch-card-2-main w-full px-4">
            <FitText align="center" className="arch-card-2-name max-w-[200px] mx-auto text-center">{name}</FitText>
            <FitText align="center" className="arch-card-2-title max-w-[200px] mx-auto text-center mt-1">{title}</FitText>
            <div className="arch-card-2-divider" />
            <div className="arch-card-2-contact w-full">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText align="center" key={k} className="max-w-[200px] mx-auto text-center mt-1">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="arch-card-2-footer w-full">
            <p className="arch-card-2-tagline">"Protecting nature's beauty"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
