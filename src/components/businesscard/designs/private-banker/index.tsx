import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function PrivateBanker({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--private-banker !p-0`}>
      <div className="card arch-arch-card-8 w-full h-full">
        <div className="arch-card-8-content">
          <div className="arch-card-8-crest" />
          <div className="arch-card-8-header w-full">
            <FitText align="left" className="arch-card-8-brand block max-w-full px-4">{data.company || "Private Banking"}</FitText>
          </div>
          <div className="arch-card-8-main w-full">
            <FitText align="left" className="arch-card-8-name max-w-full px-2">{name}</FitText>
            <FitText align="left" className="arch-card-8-title max-w-full px-4">{title}</FitText>
            <div className="arch-card-8-divider" />
            <div className="arch-card-8-contact w-full">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="center" className="max-w-[200px] mx-auto text-center">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="arch-card-8-footer w-full">
            <p className="arch-card-8-tagline">"Trusted since 1892"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
