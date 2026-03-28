import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function ArtisanRoaster({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const nameParts = name.split(" ");
  const formattedName = nameParts.length > 1 ? `${nameParts[0]}\n${nameParts.slice(1).join(" ")}` : name;

  return (
    <div className={`${baseClass} card--artisan-roaster !p-0`}>
      <div className="card card-5 w-full h-full">
        <div className="card-5-content">
          <div className="card-5-header w-full">
            <FitText align="left" className="card-5-brand w-full px-4">{data.company || "Artisan Coffee Co."}</FitText>
            <div className="card-5-badge">
              <span className="card-5-badge-inner">EST. {new Date().getFullYear()}</span>
            </div>
          </div>
          <h1 className="card-5-name max-w-[200px] text-center" style={{ whiteSpace: "pre-line" }}>{formattedName}</h1>
          <FitText align="left" className="card-5-title max-w-[180px]">{title}</FitText>
          <div className="card-5-divider" />
          <div className="card-5-contact max-w-[200px]">
            {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 3).map(k => (
              <FitText key={k} align="left" className=" w-full">{data[k]}</FitText>
            ))}
          </div>
          <div className="card-5-footer">
            <p className="card-5-tagline">"From bean to cup"</p>
          </div>
        </div>
      </div>
    </div>
  );
}
