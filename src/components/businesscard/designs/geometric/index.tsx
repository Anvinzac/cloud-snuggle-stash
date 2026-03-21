import type { CSSProperties } from "react";
import { BusinessCardTemplateProps } from "../types";

export default function Geometric({ data, selectedFields, baseClass, color }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--geometric !p-0`} style={{ "--card-accent": color } as CSSProperties}>
      <div className="ga-motif"></div>
      <div className="ga-shape"></div>
      
      <div className="ga-content w-full h-full">
        <div className="ga-line"></div>
        <div className="ga-text w-full h-full flex flex-col pt-6 pb-2 min-w-0 pr-4">
          <h1 className="ga-name" style={{ whiteSpace: 'pre-line' }}>{name.replace(' ', '\n')}</h1>
          <h2 className="ga-role truncate">{title}</h2>
          
          <ul className="ga-info mt-auto">
            {fields.filter(k => !["name","title"].includes(k)).slice(0,3).map(k => (
              <li key={k} className="truncate">{data[k]}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
