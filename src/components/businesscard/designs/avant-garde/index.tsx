import type { CSSProperties } from "react";
import { BusinessCardTemplateProps } from "../types";

export default function AvantGarde({ data, selectedFields, baseClass, color }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  
  const parts = name.split(' ');
  const first = parts.slice(0, -1).join(' ') || name;
  const last = parts.length > 1 ? parts[parts.length - 1] : '';

  return (
    <div className={`${baseClass} card--avant-garde !p-0`} style={{ "--card-accent": color } as CSSProperties}>
      <div className="ag-frame"></div>
      <div className="ag-content w-full h-full !p-0">
        <header className="ag-header">
          <h1 className="ag-name">{first}{last && <><br/>{last}.</>}</h1>
          <h2 className="ag-role">{title}</h2>
        </header>
        <div className="ag-copper-accent"></div>
        <footer className="ag-footer">
          {fields.filter(k => !["name","title"].includes(k)).slice(0, 3).map(k => (
            <p key={k} className="truncate">{data[k]}</p>
          ))}
        </footer>
      </div>
    </div>
  );
}
