import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function ModernApothecary({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--modern-apothecary !p-0`}>
      <div className="card card-6 w-full h-full">
        <div className="card-6-content">
          <div className="card-6-header w-full">
            <FitText align="left" className="card-6-brand w-full px-4">{data.company || "Apothecary Studio"}</FitText>
            <div className="card-6-logo" />
          </div>
          <div className="card-6-main w-full">
            <FitText align="left" className="card-6-name max-w-full px-2">{name}</FitText>
            <FitText align="left" className="card-6-title max-w-full px-4">{title}</FitText>
            <div className="card-6-divider" />
            <div className="card-6-contact max-w-[200px] mx-auto">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <div key={k} className="card-6-contact-item">
                  <FitText align="left" className=" w-full">{data[k]}</FitText>
                </div>
              ))}
            </div>
          </div>
          <div className="card-6-footer">
            <p className="card-6-quote">"Healing through design"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
