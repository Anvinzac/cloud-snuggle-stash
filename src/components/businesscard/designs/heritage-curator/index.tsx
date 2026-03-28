import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function HeritageCurator({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");
  const initials = name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase() || "HC";

  return (
    <div className={`${baseClass} card--heritage-curator !p-0`}>
      <div className="card card-1 w-full h-full">
        <div className="card-1-content">
          <div className="card-1-monogram text-[12px] font-['Cinzel'] tracking-[2px] text-[var(--hc-cobalt)]">{initials}</div>
          <div className="card-1-sidebar">
            <span className="card-1-brand">{data.company || "Heritage Collection"}</span>
            <div className="card-1-info">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="left" className="min-w-0 max-w-[80px]">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="card-1-main">
            <FitText align="left" className="card-1-title max-w-full">{title}</FitText>
            <h1 className="card-1-name">
              <FitText align="left" className="block max-w-full">{firstName}</FitText>
              {lastName && <FitText align="left" className="block max-w-full">{lastName}</FitText>}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
