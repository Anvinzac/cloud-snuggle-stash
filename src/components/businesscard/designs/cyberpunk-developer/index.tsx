import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function CyberpunkDeveloper({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const nameParts = name.split(" ");
  const formattedName = nameParts.length > 1 ? `${nameParts[0]}\n${nameParts.slice(1).join(" ")}` : name;

  return (
    <div className={`${baseClass} card--cyberpunk-developer !p-0`}>
      <div className="card card-14 w-full h-full">
        <div className="card-14-content">
          <div className="card-14-corner card-14-corner-tl" />
          <div className="card-14-corner card-14-corner-tr" />
          <div className="card-14-corner card-14-corner-bl" />
          <div className="card-14-corner card-14-corner-br" />
          <div className="card-14-header">
            <FitText align="left" className="card-14-brand max-w-[120px]">{data.company || "NEXUS.CODE"}</FitText>
            <FitText align="left" className="card-14-status max-w-[80px]">{data.status || "ONLINE"}</FitText>
          </div>
          <div className="card-14-main">
            <FitText align="left" className="card-14-label max-w-[180px]">// {data.notes || "FULL STACK"}</FitText>
            <h1 className="card-14-name max-w-[200px]" style={{ whiteSpace: "pre-line" }}>{formattedName.toUpperCase()}</h1>
            <div className="card-14-slash">
              <div className="card-14-slash-line" />
              <FitText align="left" className="card-14-slash-text max-w-[120px]">{title.toUpperCase()}</FitText>
            </div>
            <div className="card-14-contact">
              {fields.filter(k => !["name", "title", "company", "status", "notes"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="left" className="max-w-[180px]">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="card-14-footer">
            <span className="card-14-badge">v3.2.1</span>
            <span className="card-14-version">BUILD: {new Date().getFullYear()}.{String(new Date().getMonth() + 1).padStart(2, '0')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
