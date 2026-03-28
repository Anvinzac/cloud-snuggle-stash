import type { CSSProperties } from "react";
import { BusinessCardTemplateProps } from "../types";
import { FitText } from "../FitText";

export default function MichelinChef({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--michelin-chef !p-0`}>
      <div className="card card-11 w-full h-full">
        <div className="card-11-content">
          <div className="card-11-header w-full px-4">
            <FitText align="center" className="card-11-name w-full">{name}</FitText>
          </div>
          <div className="card-11-main">
            <div className="card-11-section flex justify-between items-center w-full">
              <p className="card-11-section-label min-w-[50px]">Title</p>
              <div className="flex-1 w-full pl-2 overflow-hidden"><FitText align="right" className="card-11-section-value">{title}</FitText></div>
            </div>
            <div className="card-11-divider" />
            <div className="card-11-section flex justify-between items-center w-full">
              <p className="card-11-section-label min-w-[50px]">Company</p>
              <div className="flex-1 w-full pl-2 overflow-hidden"><FitText align="right" className="card-11-section-value">{data.company || "Le Jardin"}</FitText></div>
            </div>
            <div className="card-11-divider" />
            <div className="card-11-section flex justify-between items-center w-full">
              <p className="card-11-section-label min-w-[50px]">Specialty</p>
              <div className="flex-1 w-full pl-2 overflow-hidden"><FitText align="right" className="card-11-section-value">{data.notes || "Cuisine"}</FitText></div>
            </div>
          </div>
          <div className="card-11-footer w-[calc(100%-64px)] left-8">
            <div className="card-11-logo flex items-center justify-center font-['Cinzel'] text-xs text-[var(--mc-copper)]">MC</div>
            <div className="card-11-contact max-w-[140px] flex flex-col items-end w-full overflow-hidden">
              {fields.filter(k => !["name", "title", "company", "notes"].includes(k)).slice(0, 2).map(k => (
                <FitText key={k} align="right" className="w-full text-right">{data[k]}</FitText>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
