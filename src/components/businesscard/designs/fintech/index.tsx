import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function FinTech({ data, selectedFields, baseClass, color }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const company = data.company || "";

  return (
    <div className={`${baseClass} card--fintech !p-0`} style={{ "--card-accent": color } as CSSProperties}>
      <div className="ft-orbs">
        <div className="ft-orb ft-orb-1"></div>
        <div className="ft-orb ft-orb-2"></div>
        <div className="ft-orb ft-orb-3"></div>
      </div>
      
      <div className="ft-content w-full h-full">
        <div className="ft-brand">
          <div className="ft-logo-mark"></div>
          {company && <h1 className="ft-company-name break-words text-center">{company}</h1>}
        </div>
        
        <div className="ft-glass-panel mt-auto">
          <FitText align="left" className="ft-name w-full">{name}</FitText>
          <FitText align="left" className="ft-role w-full">{title}</FitText>
          <div className="ft-divider"></div>
          <ul className="ft-info">
            {fields.filter(k => !["name","title","company"].includes(k)).slice(0,3).map(k => (
              <FitText key={k} align="left" className=" w-full">{data[k]}</FitText>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
