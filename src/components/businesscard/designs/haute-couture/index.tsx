import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function HauteCouture({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");
  const initials = firstName.charAt(0).toUpperCase() || "V";

  return (
    <div className={`${baseClass} card--haute-couture !p-0`}>
      <div className="card card-4 w-full h-full">
        <div className="card-4-content">
          <div className="card-4-header">
            <FitText align="left" className="card-4-brand block max-w-[200px]">{data.company || "Maison Noir"}</FitText>
          </div>
          <div className="card-4-main max-w-[180px]">
            <FitText align="left" className="card-4-name max-w-full">{firstName}</FitText>
            <FitText align="left" className="card-4-surname max-w-full">{lastName}</FitText>
            <FitText align="left" className="card-4-title max-w-full">{title}</FitText>
          </div>
          <div className="card-4-monogram font-['Playfair_Display'] text-[28px] italic text-[rgba(255,255,255,0.4)]">{initials}</div>
          <div className="card-4-footer">
            <div className="card-4-contact max-w-[200px]">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 2).map(k => (
                <FitText key={k} align="left" className=" w-full">{data[k]}</FitText>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
