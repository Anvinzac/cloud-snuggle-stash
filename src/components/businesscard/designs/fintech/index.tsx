import { BusinessCardTemplateProps } from "../types";

export default function FinTech({ data, selectedFields, baseClass }: BusinessCardTemplateProps) {
  const fields = selectedFields.filter((k) => data[k]?.trim());
  const name = data.name || "Your Name";
  const title = data.title || "";
  const company = data.company || "";

  return (
    <div className={`${baseClass} card--fintech !p-0`}>
      <div className="ft-orbs">
        <div className="ft-orb ft-orb-1"></div>
        <div className="ft-orb ft-orb-2"></div>
        <div className="ft-orb ft-orb-3"></div>
      </div>
      
      <div className="ft-content w-full h-full">
        <div className="ft-brand">
          <div className="ft-logo-mark"></div>
          {company && <h1 className="ft-company-name break-words text-center">{company}</h1>}
        </div>
        
        <div className="ft-glass-panel mt-auto">
          <h2 className="ft-name truncate">{name}</h2>
          <p className="ft-role truncate">{title}</p>
          <div className="ft-divider"></div>
          <ul className="ft-info">
            {fields.filter(k => !["name","title","company"].includes(k)).slice(0,3).map(k => (
              <li key={k} className="truncate">{data[k]}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
