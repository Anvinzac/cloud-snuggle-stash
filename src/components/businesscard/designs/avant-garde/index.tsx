import type { CSSProperties } from "react";
import { BusinessCardTemplateProps } from "../types";
import { FitText } from "../FitText";

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
        <header className="ag-header w-full px-4">
          <FitText align="center" className="ag-name">{first}{last && <><br/>{last}.</>}</FitText>
          <FitText align="center" className="ag-role">{title}</FitText>
        </header>
        <div className="ag-copper-accent"></div>
        <footer className="ag-footer w-full">
          {fields.filter(k => !["name","title"].includes(k)).slice(0, 3).map(k => (
            <FitText key={k} align="left">{data[k]}</FitText>
          ))}
        </footer>
      </div>
    </div>
  );
}
