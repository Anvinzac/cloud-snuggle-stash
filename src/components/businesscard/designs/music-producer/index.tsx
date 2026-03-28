import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function MusicProducer({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const nameParts = name.split(" ");
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

  return (
    <div className={`${baseClass} card--music-producer !p-0`}>
      <div className="card arch-arch-card-13 w-full h-full">
        <div className="arch-card-13-content">
          <span className="arch-card-13-notes tabular-nums">♪ ♫</span>
          <div className="arch-card-13-header w-[calc(100%-80px)]">
            <FitText align="left" className="arch-card-13-brand block max-w-full">{data.company || "SoundWave Studios"}</FitText>
          </div>
          <div className="arch-card-13-main w-[calc(100%-64px)]">
            <FitText align="left" className="arch-card-13-name max-w-[200px]">{firstName.toUpperCase()}</FitText>
            <FitText align="left" className="arch-card-13-surname max-w-[200px]">{lastName.toUpperCase()}</FitText>
            <FitText align="left" className="arch-card-13-title max-w-[200px]">{title}</FitText>
            <div className="arch-card-13-wave">
              <span /><span /><span /><span /><span />
            </div>
          </div>
          <div className="arch-card-13-footer w-[calc(100%-64px)]">
            <div className="arch-card-13-contact w-full">
              {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 2).map(k => (
                <FitText key={k} align="left" className="max-w-[200px]">{data[k]}</FitText>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
