import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function AvantGardeStudio({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const nameParts = name.split(" ");
  const formattedName = nameParts.length > 1 ? `${nameParts[0]}\n${nameParts.slice(1).join(" ")}` : name;

  return (
    <div className={`${baseClass} card--avant-garde-studio !p-0`}>
      <div className="card card-12 w-full h-full">
        <div className="card-12-content">
          <div className="card-12-header">
            <FitText align="left" className="card-12-brand max-w-full px-4">{data.company || "KONSTRUCT"}</FitText>
          </div>
          <div className="card-12-main">
            <h1 className="card-12-name max-w-[200px]" style={{ whiteSpace: "pre-line" }}>{formattedName}</h1>
            <FitText align="left" className="card-12-title max-w-[200px]">{title}</FitText>
            <div className="card-12-slash" />
            <div className="card-12-contact">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="left" className="max-w-[200px]">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="card-12-footer">
            <FitText align="left" className="card-12-badge max-w-[100px]">{data.status || "AVAILABLE"}</FitText>
            <FitText align="left" className="card-12-id max-w-[100px]">{data.id?.substring(0, 11).toUpperCase() || "KB-2024-001"}</FitText>
          </div>
        </div>
      </div>
    </div>
  );
}
