import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function ArtisanBaker({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";

  return (
    <div className={`${baseClass} card--artisan-baker !p-0`}>
      <div className="card arch-arch-card-5 w-full h-full">
        <div className="arch-card-5-content">
          <div className="arch-card-5-bread" />
          <div className="arch-card-5-header w-full">
            <FitText align="left" className="arch-card-5-brand w-full px-4">{data.company || "Artisan Bakery"}</FitText>
          </div>
          <div className="arch-card-5-main w-full">
            <FitText align="center" className="arch-card-5-name max-w-[200px] mx-auto text-center">{name}</FitText>
            <FitText align="center" className="arch-card-5-title max-w-[200px] mx-auto text-center">{title}</FitText>
            <div className="arch-card-5-divider" />
            <div className="arch-card-5-contact w-full">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
                <FitText key={k} align="center" className="max-w-[200px] mx-auto text-center">{data[k]}</FitText>
              ))}
            </div>
          </div>
          <div className="arch-card-5-footer w-full">
            <p className="arch-card-5-tagline">"Baked with love"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
