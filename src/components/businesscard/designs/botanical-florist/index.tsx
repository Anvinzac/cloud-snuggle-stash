import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function BotanicalFlorist({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const initial = (data.company || "Verdant Studio").charAt(0).toUpperCase();

  return (
    <div className={`${baseClass} card--botanical-florist !p-0`}>
      <div className="card card-13 w-full h-full">
        <div className="card-13-content">
          <div className="card-13-leaf" />
          <div className="card-13-header w-full overflow-hidden">
            <FitText align="center" className="card-13-brand w-full px-4 overflow-hidden" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {data.company || "Verdant Studio"}
            </FitText>
            <div className="card-13-monogram" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontStyle: "italic", color: "var(--bf-forest)", opacity: 0.6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              {initial}
            </div>
          </div>
          <div className="card-13-main w-full overflow-hidden">
            <FitText align="center" className="card-13-name w-full px-2 overflow-hidden" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{name}</FitText>
            <FitText align="center" className="card-13-title w-full px-4 overflow-hidden" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>{title}</FitText>
            <div className="card-13-divider" />
            <div className="card-13-contact w-full overflow-hidden">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="center" className="w-full px-4 overflow-hidden" style={{ fontFamily: "'Libre Franklin', sans-serif" }}>{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="card-13-footer w-full overflow-hidden">
            <p className="card-13-quote" style={{ fontFamily: "'Cormorant Garamond', serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>"Where nature meets art"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
