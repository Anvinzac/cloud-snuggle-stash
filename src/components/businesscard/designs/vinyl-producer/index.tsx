import type { CSSProperties } from "react";
import { FitText } from "../FitText";
import { BusinessCardTemplateProps } from "../types";

export default function VinylProducer({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  return (
    <div className={`${baseClass} card--vinyl-producer !p-0`}>
      <div className="card card-10 w-full h-full">
        <div className="card-10-content">
          <div className="card-10-header w-full">
            <FitText align="left" className="card-10-brand max-w-[120px]">{data.company || "Groove Records"}</FitText>
            <span className="card-10-label">EST. {new Date().getFullYear()}</span>
          </div>
          <div className="card-10-main max-w-[150px]">
            <FitText align="left" className="card-10-name max-w-full">{firstName}</FitText>
            <FitText align="left" className="card-10-surname max-w-full">{lastName}</FitText>
            <FitText align="left" className="card-10-title max-w-full">{title}</FitText>
          </div>
          <div className="card-10-line" />
          <div className="card-10-contact max-w-[180px]">
            {fields.filter(k => !["name", "title", "company"].includes(k)).slice(0, 2).map(k => (
              <FitText key={k} align="left" className=" w-full">{data[k]}</FitText>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
