import type { CSSProperties } from "react";
import { BusinessCardTemplateProps } from "../types";

export default function Architect({ data, selectedFields, baseClass, color }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--architect !p-0`} style={{ "--card-accent": color } as CSSProperties}>
      <div className="ea-content w-full h-full">
        <header className="ea-header">
          <h1 className="ea-name" style={{ whiteSpace: 'pre-line' }}>{name.replace(' ', '\n')}</h1>
          <h2 className="ea-role mt-2 truncate">{title}</h2>
        </header>
        
        <div className="ea-footer-box">
          <ul className="ea-info">
            {fields.filter(k => !["name","title"].includes(k)).slice(0,3).map(k => (
              <li key={k} className="truncate flex items-center justify-end gap-1">
                {data[k]}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
