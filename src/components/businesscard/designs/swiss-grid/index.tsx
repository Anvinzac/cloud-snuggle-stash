import type { CSSProperties } from "react";
import { BusinessCardTemplateProps } from "../types";

export default function SwissGrid({ data, selectedFields, baseClass, color }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--swiss-grid !p-0`} style={{ "--card-accent": color } as CSSProperties}>
      <div className="sg-grid-container w-full h-full">
        <div className="sg-cell sg-cell--logo">
          <div className="sg-brand-mark"></div>
        </div>
        <div className="sg-cell sg-cell--top-right"></div>
        
        <div className="sg-cell sg-cell--main">
          <h1 className="sg-name" style={{ whiteSpace: 'pre-line' }}>{name.replace(' ', '\n')}</h1>
          <h2 className="sg-role">{title}</h2>
        </div>

        <div className="sg-cell sg-cell--data">
          <div className="sg-barcode"></div>
          <ul className="sg-info">
            {fields.filter(k => !["name","title"].includes(k)).slice(0, 3).map(k => (
              <li key={k} className="truncate">{data[k]}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
